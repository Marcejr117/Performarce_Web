/* empty css                             */import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, e as renderComponent } from '../astro_2d8ff2b1.mjs';
import { $ as $$Layout } from './contact_23684951.mjs';

const $$Astro$1 = createAstro();
const $$Map = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Map;
  return renderTemplate`${maybeRenderHead()}<main> <div id="map" class="h-[29rem] mx-10 md:mx-28 rounded-xl border-Custom_Blue border-2 hover:shadow-2xl overflow-hidden mb-5"> <iframe class="h-full w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3100.7480919952473!2d-1.871054325239329!3d38.99824524074934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd665fb487f1ea51%3A0x578c1f902ab4afec!2sTalleres%20Marcelino!5e0!3m2!1ses!2ses!4v1709739348889!5m2!1ses!2ses" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> </div> </main>`;
}, "D:/Proyectos_astro/Performarce/Web/src/components/Map.astro", void 0);

const $$Astro = createAstro();
const $$Location = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Location;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Performarce", "current_page": "Ubicacion" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-center text-3xl dark:text-gray-300 pt-10 pb-5 text-Light_Orange font-bold">
Donde estamos
</h1> <div class="w-full"> ${renderComponent($$result2, "Map", $$Map, {})} </div> ` })}`;
}, "D:/Proyectos_astro/Performarce/Web/src/pages/location.astro", void 0);

const $$file = "D:/Proyectos_astro/Performarce/Web/src/pages/location.astro";
const $$url = "/location";

export { $$Location as default, $$file as file, $$url as url };
