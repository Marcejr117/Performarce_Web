/* empty css                             */import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute, e as renderComponent } from '../astro_2d8ff2b1.mjs';
import { $ as $$Layout } from './contact_23684951.mjs';
import { Client } from 'basic-ftp';

const $$Astro$1 = createAstro();
const $$OfertasCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$OfertasCard;
  const { nombre, direccion } = Astro2.props;
  const nombre_sinExtention = nombre.replace(/\.pdf$/, "");
  return renderTemplate`${maybeRenderHead()}<div class="group relative bg-Light_Orange/90 dark:bg-Light_Orange rounded-xl p-2 flex flex-col justify-center items-center overflow-hidden hover:scale-105 transition-transform ease-in-out"> <div class="group md:hidden block md:group-hover:block absolute md:group-hover:absolute bg-none md:bg-white/50 w-full h-full"> <a${addAttribute(direccion, "href")} target="_blank" class="h-full w-full"> <div class="h-full w-full"></div> </a> </div> <iframe${addAttribute(direccion, "src")} class="h-96 rounded-xl"></iframe> <h4 class="dark:bg-gray-700/85 dark:text-gray-300 text-black bg-none border-[1px] border-black rounded-xl dark:border-none p-1 w-full text-center mt-1"> ${nombre_sinExtention} </h4> </div>`;
}, "D:/Proyectos_astro/Performarce/Web/src/components/OfertasCard.astro", void 0);

const $$Astro = createAstro();
const $$OfertasForestal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$OfertasForestal;
  const client = new Client();
  client.ftp.verbose = false;
  await client.access({
    host: "jr117.com.es",
    // Replace with your actual host
    user: "sem3993",
    // Replace with your actual username
    password: "MiWeb1234",
    // Replace with your actual password
    secure: false
    // Adjust for secure connections if needed
  });
  await client.cd("forestal");
  const fileList = await client.list();
  console.log(fileList);
  for (let i = 0; i < fileList.length; i++) {
    const FileInfo = fileList[i];
    await client.downloadTo(FileInfo.name, FileInfo.name);
    console.log(FileInfo.name);
  }
  client.close();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Performarce", "current_page": "Ofertas Forestal" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="dark:text-gray-300 text-center font-bold text-4xl my-5 text-Light_Orange">
Ofertas de Jardineria y Forestal
</h1> <hr class="dark:border-gray-500 mx-10 border-black"> <main class="flex gap-16 justify-center flex-wrap my-10 mx-5"> ${fileList.map((FileInfo) => renderTemplate`${renderComponent($$result2, "OfertasCard", $$OfertasCard, { "nombre": FileInfo.name, "direccion": FileInfo.name })}`)} </main> ` })}`;
}, "D:/Proyectos_astro/Performarce/Web/src/pages/ofertas_forestal.astro", void 0);

const $$file = "D:/Proyectos_astro/Performarce/Web/src/pages/ofertas_forestal.astro";
const $$url = "/ofertas_forestal";

export { $$OfertasForestal as default, $$file as file, $$url as url };
