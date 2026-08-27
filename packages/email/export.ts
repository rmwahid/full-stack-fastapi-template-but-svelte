import { Renderer } from "@better-svelte-email/server"
import { compile } from "svelte/compiler"
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, "..", "..", "backend", "app", "email-templates")
const cacheDir = join(here, ".bse-cache")

const EMAILS_DIR = join(here, "emails")
const BSE_COMPONENTS_DIR = join(
	here,
	"..",
	"..",
	"node_modules",
	"@better-svelte-email",
	"components",
	"dist",
	"components",
)

function listSvelteFiles(dir: string): string[] {
	const out: string[] = []
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name)
		if (entry.isDirectory()) out.push(...listSvelteFiles(full))
		else if (entry.name.endsWith(".svelte")) out.push(full)
	}
	return out
}

function compileAll() {
	rmSync(cacheDir, { recursive: true, force: true })
	mkdirSync(cacheDir, { recursive: true })

	const own = [...listSvelteFiles(EMAILS_DIR), ...listSvelteFiles(join(here, "ui"))]
	for (const file of own) compileToCache(file)

	const bseComponents = readdirSync(BSE_COMPONENTS_DIR).filter((f) => f.endsWith(".svelte"))
	for (const name of bseComponents) compileToCache(join(BSE_COMPONENTS_DIR, name), "bse__")

	const shimLines = bseComponents.map(
		(f) => `export { default as ${f.replace(/\.svelte$/, "")} } from './bse__${f.replace(/\.svelte$/, ".svelte.js")}';`,
	)
	writeFileSync(join(cacheDir, "bse_components.js"), shimLines.join("\n"), "utf8")
}

function compileToCache(file: string, prefix = "") {
	const inBse = file.startsWith(BSE_COMPONENTS_DIR)
	const rel = inBse ? file.split(/[\\/]/).pop()! : relative(here, file)
	const flat = `${prefix}${rel.replace(/[\\/]/g, "__").replace(/\.svelte$/, ".svelte.js")}`
	const source = readFileSync(file, "utf8")
	const name = flat.replace(/[\\/.]/g, "_").replace(/^_+/, "")
	const result = compile(source, {
		filename: file,
		name,
		generate: "server",
	})
	let code = result.js.code
	code = code.replace(/(from\s+["'])([^"']*\.svelte)(["'])/g, (_m, pre, spec, post) => {
		const target = inBse ? join(BSE_COMPONENTS_DIR, spec) : join(dirname(file), spec)
		if (target.endsWith(".svelte")) {
			const targetRel = inBse ? target : relative(here, target)
			const flatTarget = `${inBse ? "bse__" : ""}${targetRel
				.replace(/[\\/]/g, "__")
				.replace(/\.svelte$/, ".svelte.js")}`
			return `${pre}./${flatTarget}${post}`
		}
		return `${pre}${spec}${post}`
	})
	code = code.replace(/(from\s+["'])\.\.\/(utils[^"']*)(["'])/g, "$1@better-svelte-email/components/$2$3")
	code = code.replace(
		/from ["']@better-svelte-email\/components["']/g,
		'from "./bse_components.js"',
	)
	writeFileSync(join(cacheDir, flat), code, "utf8")
	return flat
}

async function loadComponent(emailName: string) {
	const flat = `emails__${emailName}.svelte.js`
	const mod = await import(pathToFileURL(join(cacheDir, flat)).href)
	return mod.default
}

compileAll()

const renderer = new Renderer()

const templates = ["test_email", "reset_password", "new_account"]

mkdirSync(outDir, { recursive: true })

for (const name of templates) {
	const component = await loadComponent(name)
	const rendered = await renderer.render(component)
	const html = rendered.replace(/\[\[\s*([a-z_]+)\s*\]\]/gi, "{{$1}}")
	const target = join(outDir, `${name}.html`)
	writeFileSync(target, html, "utf8")
	console.log(`exported ${target}`)
}
