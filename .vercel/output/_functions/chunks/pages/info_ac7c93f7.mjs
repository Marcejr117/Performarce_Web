/* empty css                             */import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as renderSlot, e as renderComponent } from '../astro_2d8ff2b1.mjs';
import { $ as $$Layout } from './contact_23684951.mjs';

const $$Astro$2 = createAstro();
const $$InfoCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$InfoCard;
  return renderTemplate`${maybeRenderHead()}<div class="group flex max-w-xs flex-col overflow-hidden rounded-lg bg-gray-200 p-2 shadow-xl dark:bg-gray-900 sm:max-w-7xl sm:flex-row hover:animate-pulsing justify-center items-center"> <div class="p-2 sm:w-1/2"> ${renderSlot($$result, $$slots["image"])} </div> <div class="p-3 sm:w-1/2 sm:p-6"> <div class="p-2 flex flex-col h-full"> <span class="text-center block text-2xl font-semibold dark:text-rose-500/70 text-orange-700 sm:mt-2"> ${renderSlot($$result, $$slots["title"])} </span> <div class=""></div> <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 text-justify"> ${renderSlot($$result, $$slots["content"])} </p> <p class="w-auto m-auto mt-16"> ${renderSlot($$result, $$slots["icon"])} </p> </div> </div> </div>`;
}, "D:/Proyectos_astro/Performarce/Web/src/components/InfoCard.astro", void 0);

const $$Astro$1 = createAstro();
const $$InfoCardInverse = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$InfoCardInverse;
  return renderTemplate`${maybeRenderHead()}<div class="group flex max-w-xs flex-col-reverse overflow-hidden rounded-lg bg-gray-200 p-2 shadow-xl dark:bg-gray-900 sm:max-w-7xl sm:flex-row hover:animate-pulsing justify-center items-center"> <div class="p-3 sm:w-1/2 sm:p-6"> <div class="p-2 flex flex-col h-full"> <span class="text-center block text-2xl font-semibold dark:text-rose-500/70 text-orange-600 sm:mt-2"> ${renderSlot($$result, $$slots["title"])} </span> <div class=""></div> <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 text-justify"> ${renderSlot($$result, $$slots["content"])} </p> <p class="w-auto m-auto mt-16"> ${renderSlot($$result, $$slots["icon"])} </p> </div> </div> <div class="p-2 sm:w-1/2"> ${renderSlot($$result, $$slots["image"])} </div> </div>`;
}, "D:/Proyectos_astro/Performarce/Web/src/components/InfoCardInverse.astro", void 0);

const $$Astro = createAstro();
const $$Info = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Info;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "current_page": "Informacion", "title": "Performarce" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="flex justify-center items-center flex-col grow dark:bg-gray-900 gap-5 py-10"> <!-- compra y venta --> ${renderComponent($$result2, "InfoCard", $$InfoCard, {}, { "content": ($$result3) => renderTemplate`<a>
Nuestra empresa vende productos tanto nuevos como usados.
                Revisados, siempre trabajamos con productos de alta calidad. Y
                Siempre con los mejores precios, garantizados.
</a>`, "icon": ($$result3) => renderTemplate`<a> <svg class="dark:stroke-Custom_White stroke-black dark:hover:stroke-slate-50 hover:dark:stroke-gray-50 hover:stroke-orange-700" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path><path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25"></path><path d="M12.5 15.5l2 2"></path><path d="M15 13l2 2"></path> </svg> </a>`, "image": ($$result3) => renderTemplate`<img class="h-60 w-full rounded object-cover sm:h-80" src="/assets/info/com_ven.jpg" alt="Imagen del taller">`, "title": ($$result3) => renderTemplate`<a> Compra y Venta</a>` })} <hr class="my-2 h-0.5 w-48 shrink grow border-t-0 dark:bg-neutral-100 bg-orange-700/50 opacity-100 dark:opacity-50"> <!-- servicio --> ${renderComponent($$result2, "InfoCardInverse", $$InfoCardInverse, {}, { "content": ($$result3) => renderTemplate`<a>
Los mejores expertos en cada campo, en caso de que usted tenga.
                Alguna duda, tanto de motocicletas o scooters, como de
                jardinería. Y forestal, nosotros se la resolvemos, nuestros
                clientes son lo. Primero, por eso, nuestro personal le ofrecerá
                un trato. Excepcional.
</a>`, "icon": ($$result3) => renderTemplate`<a> <svg class="dark:stroke-Custom_White stroke-black hover:dark:stroke-gray-50 hover:stroke-orange-700" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 13c-1.2 0-3.07.34-4.5 1c-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25m-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22c.88-.3 1.96-.53 3.02-.53c2.44 0 5 1.21 5 1.75zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5S4 6.57 4 8.5S5.57 12 7.5 12m0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2m9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5S13 6.57 13 8.5s1.57 3.5 3.5 3.5m0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2"></path></svg> </a>`, "image": ($$result3) => renderTemplate`<img class="h-60 w-full rounded object-cover sm:h-80" src="/assets/info/servicio.jpg" alt="Imagen del taller">`, "title": ($$result3) => renderTemplate`<a> Servicio</a>` })} <hr class="my-2 h-0.5 w-48 grow border-t-0 dark:bg-neutral-100 bg-orange-700/50 opacity-100 dark:opacity-50"> <!-- historia --> ${renderComponent($$result2, "InfoCard", $$InfoCard, {}, { "content": ($$result3) => renderTemplate`<a>
Talleres Marcelino lleva más de 40 años contigo, ofreciendo un
                servicio de calidad, a los mejores precios, haciendo que
                nuestros clientes estén satisfechos con los resultados.
</a>`, "icon": ($$result3) => renderTemplate`<a> <svg class="dark:stroke-Custom_White stroke-black dark:hover:stroke-slate-50 hover:dark:stroke-gray-50 hover:stroke-orange-700" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path><path d="M10 12l4 0"></path></svg> </a>`, "image": ($$result3) => renderTemplate`<img class="h-60 w-full rounded object-cover sm:h-80" src="/assets/info/taller.png" alt="Imagen del taller">`, "title": ($$result3) => renderTemplate`<a> Historia</a>` })} </main> ` })}`;
}, "D:/Proyectos_astro/Performarce/Web/src/pages/info.astro", void 0);

const $$file = "D:/Proyectos_astro/Performarce/Web/src/pages/info.astro";
const $$url = "/info";

export { $$Info as default, $$file as file, $$url as url };
