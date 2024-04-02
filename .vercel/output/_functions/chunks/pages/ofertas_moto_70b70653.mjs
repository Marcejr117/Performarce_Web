/* empty css                             */import { c as createAstro, a as createComponent, r as renderTemplate, e as renderComponent, m as maybeRenderHead } from '../astro_2d8ff2b1.mjs';
import { $ as $$Layout } from './contact_23684951.mjs';

const $$Astro = createAstro();
const $$OfertasMoto = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$OfertasMoto;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Performarce", "current_page": "Ofertas Motos" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<h1 class="dark:text-gray-300 text-center font-bold text-4xl my-5 text-Light_Orange">
Ofertas de Motos y Complementos
</h1> <hr class="dark:border-gray-500 mx-10 border-black"> <main class="flex gap-16 justify-center flex-wrap my-10 mx-5"> <ul id="lista-archivos"></ul> </main> ` })}`;
}, "D:/Proyectos_astro/Performarce/Web/src/pages/ofertas_moto.astro", void 0);

const $$file = "D:/Proyectos_astro/Performarce/Web/src/pages/ofertas_moto.astro";
const $$url = "/ofertas_moto";

export { $$OfertasMoto as default, $$file as file, $$url as url };
