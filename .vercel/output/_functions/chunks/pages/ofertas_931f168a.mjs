/* empty css                             */import { c as createAstro, a as createComponent, r as renderTemplate, e as renderComponent, m as maybeRenderHead } from '../astro_2d8ff2b1.mjs';
import { $ as $$Layout } from './contact_23684951.mjs';
/* empty css                             */
const $$Astro = createAstro();
const $$Ofertas = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Ofertas;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Performarce", "current_page": "Ofertas", "data-astro-cid-qeumhsh7": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex-col md:flex-row h-[60vh] flex justify-center items-center md:animate-fade-in ease-in-out flex-wrap md:overflow-hidden" data-astro-cid-qeumhsh7> <a href="/ofertas_moto" class="bg-black w-full md:w-1/2 h-1/2 md:h-full md:hover:scale-[1.22] transition-transform duration-200 flex justify-center items-center" style="clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%) " data-astro-cid-qeumhsh7> <img class="blur-[2px]" src="/assets/fondos/oferta_moto.jpeg" alt="" data-astro-cid-qeumhsh7> <h1 class="absolute font-bold text-5xl custom-text text-center" data-astro-cid-qeumhsh7>
Motos y Complementos
</h1> </a> <a href="/ofertas_forestal" class="bg-yellow-500 w-full md:w-1/2 h-1/2 md:h-full md:hover:scale-[1.22] transition-transform duration-150 flex justify-center items-center" style="clip-path:polygon(10% 0, 100% 0%, 100% 100%, 0 100%)" data-astro-cid-qeumhsh7> <img class="blur-[2px]" src="/assets/fondos/oferta_forestal.jpg" alt="" data-astro-cid-qeumhsh7> <h1 class="absolute font-bold text-5xl custom-text rounded-xl px-10 text-center" data-astro-cid-qeumhsh7>
Jardineria y Forestal
</h1> </a> </div> ` })}`;
}, "D:/Proyectos_astro/Performarce/Web/src/pages/ofertas.astro", void 0);

const $$file = "D:/Proyectos_astro/Performarce/Web/src/pages/ofertas.astro";
const $$url = "/ofertas";

export { $$Ofertas as default, $$file as file, $$url as url };
