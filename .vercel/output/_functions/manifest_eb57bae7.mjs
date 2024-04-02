import { F as bold, H as red, J as yellow, K as dim, O as blue } from './chunks/astro_2d8ff2b1.mjs';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format( new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"C:/Users/Marce/AppData/Local/pnpm/global/5/.pnpm/astro@3.0.9/node_modules/astro/dist/assets/image-endpoint.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.0c6d7483.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.334cae5b.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"}],"routeData":{"route":"/ofertas_forestal","type":"page","pattern":"^\\/ofertas_forestal\\/?$","segments":[[{"content":"ofertas_forestal","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ofertas_forestal.astro","pathname":"/ofertas_forestal","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.49839e93.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"}],"routeData":{"route":"/ofertas_moto","type":"page","pattern":"^\\/ofertas_moto\\/?$","segments":[[{"content":"ofertas_moto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ofertas_moto.astro","pathname":"/ofertas_moto","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.334cae5b.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"}],"routeData":{"route":"/location","type":"page","pattern":"^\\/location\\/?$","segments":[[{"content":"location","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/location.astro","pathname":"/location","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.334cae5b.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.334cae5b.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"},{"type":"inline","content":".custom-text[data-astro-cid-qeumhsh7]{color:#fff;text-shadow:-1px -1px 0 black,1px -1px 0 black,-1px 1px 0 black,1px 1px 0 black}\n"}],"routeData":{"route":"/ofertas","type":"page","pattern":"^\\/ofertas\\/?$","segments":[[{"content":"ofertas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ofertas.astro","pathname":"/ofertas","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.334cae5b.js"}],"styles":[{"type":"external","src":"/_astro/contact.24fc7421.css"}],"routeData":{"route":"/info","type":"page","pattern":"^\\/info\\/?$","segments":[[{"content":"info","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/info.astro","pathname":"/info","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"base":"/","compressHTML":true,"componentMetadata":[["D:/Proyectos_astro/Performarce/Web/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos_astro/Performarce/Web/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos_astro/Performarce/Web/src/pages/info.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos_astro/Performarce/Web/src/pages/location.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos_astro/Performarce/Web/src/pages/ofertas.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos_astro/Performarce/Web/src/pages/ofertas_forestal.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos_astro/Performarce/Web/src/pages/ofertas_moto.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,n)=>{let s=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),s();break}});for(let e of n.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/src/pages/index.astro":"chunks/pages/index_bfa5b5f6.mjs","/src/pages/info.astro":"chunks/pages/info_ac7c93f7.mjs","/src/pages/location.astro":"chunks/pages/location_2aa4abac.mjs","/src/pages/ofertas.astro":"chunks/pages/ofertas_931f168a.mjs","/src/pages/ofertas_forestal.astro":"chunks/pages/ofertas_forestal_814793f5.mjs","/src/pages/ofertas_moto.astro":"chunks/pages/ofertas_moto_70b70653.mjs","\u0000@astrojs-manifest":"manifest_eb57bae7.mjs","\u0000@astro-page:C:/Users/Marce/AppData/Local/pnpm/global/5/.pnpm/astro@3.0.9/node_modules/astro/dist/assets/image-endpoint@_@js":"chunks/image-endpoint_da1ddaef.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_6d5a080a.mjs","\u0000@astro-page:src/pages/ofertas_forestal@_@astro":"chunks/ofertas_forestal_e979de61.mjs","\u0000@astro-page:src/pages/ofertas_moto@_@astro":"chunks/ofertas_moto_58ed2061.mjs","\u0000@astro-page:src/pages/location@_@astro":"chunks/location_cc446fd1.mjs","\u0000@astro-page:src/pages/contact@_@astro":"chunks/contact_65f21096.mjs","\u0000@astro-page:src/pages/ofertas@_@astro":"chunks/ofertas_c9c49f4c.mjs","\u0000@astro-page:src/pages/info@_@astro":"chunks/info_0ea07b6c.mjs","D:/Proyectos_astro/Performarce/Web/node_modules/.pnpm/astro@4.5.12_typescript@5.3.3/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_ffbe7e04.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.0c6d7483.js","/astro/hoisted.js?q=2":"_astro/hoisted.334cae5b.js","/astro/hoisted.js?q=1":"_astro/hoisted.49839e93.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/contact.24fc7421.css","/_astro/ofertas.76af4150.css","/logo.png","/logo_invert.png","/logo_mini.png","/logo_mini_enhance.png","/assets/grass_hd.png","/assets/H150-0226.jpg","/assets/H350-0432.jpg","/assets/H360-0231b.jpg","/icons/dark_mode.svg","/icons/light_mode.svg","/_astro/hoisted.0c6d7483.js","/_astro/hoisted.334cae5b.js","/_astro/hoisted.49839e93.js","/assets/fondos/carretera.jpg","/assets/fondos/oferta_forestal.jpg","/assets/fondos/oferta_moto.jpeg","/assets/info/com_ven.jpg","/assets/info/servicio.jpg","/assets/info/taller.png","/assets/maps/@w-25rem-@h-25rem-x-43-389636-y-5-3964332-z-11-attribution-true.png","/icons/faces/happy-face.png","/icons/faces/neutral-face.png","/icons/faces/sad-face.png","/icons/socialMedia/facebook.png","/icons/socialMedia/whatsapp.png","/icons/socialMedia/youtube.png","/ofertasPDF/forestal/Calendario.pdf","/ofertasPDF/motos/Calendario.pdf","/assets/marcas/ciclomotor/Arrow_Logo.jpg","/assets/marcas/ciclomotor/barikit-logo.png","/assets/marcas/ciclomotor/beta-racing-logo.jpg","/assets/marcas/ciclomotor/Dellorto_logo.jpg","/assets/marcas/ciclomotor/Dynavolt.png","/assets/marcas/ciclomotor/elf-logo.png","/assets/marcas/ciclomotor/endy.png","/assets/marcas/ciclomotor/euromoto.jpg","/assets/marcas/ciclomotor/italkit.png","/assets/marcas/ciclomotor/logo-gro.jpg","/assets/marcas/ciclomotor/logo-jjuan.png","/assets/marcas/ciclomotor/logo-polini.png","/assets/marcas/ciclomotor/logo-rainers.png","/assets/marcas/ciclomotor/logo-shiro.jpg","/assets/marcas/ciclomotor/logo_ng.png","/assets/marcas/ciclomotor/logo_shad.jpg","/assets/marcas/ciclomotor/macbor.png","/assets/marcas/ciclomotor/malossi_logo.png","/assets/marcas/ciclomotor/MT_Helmets.jpg","/assets/marcas/ciclomotor/NGK_logo.png","/assets/marcas/ciclomotor/nzi.jpg","/assets/marcas/ciclomotor/rq.png","/assets/marcas/ciclomotor/sym.jpg","/assets/marcas/ciclomotor/sym_texto.png","/assets/marcas/ciclomotor/TJT_logo.png","/assets/marcas/ciclomotor/tk.png","/assets/marcas/ciclomotor/vicma.jpg","/assets/marcas/ciclomotor/Zeus-helmet-Logo.jpg","/assets/marcas/forestal/Benza.jpg","/assets/marcas/forestal/benza_black.png","/assets/marcas/forestal/biss_stratton.png","/assets/marcas/forestal/Camon.png","/assets/marcas/forestal/Cubcadet_logo.jpg","/assets/marcas/forestal/Echo_logo.jpg","/assets/marcas/forestal/garland.png","/assets/marcas/forestal/Honda_logo.png","/assets/marcas/forestal/Husqvarna-logo-vertical.png","/assets/marcas/forestal/husqvarna_Logo.png","/assets/marcas/forestal/husqvarna_logo_texto.png","/assets/marcas/forestal/logo-koshin.png","/assets/marcas/forestal/MTD.png","/assets/marcas/forestal/oleomac-logo.png","/assets/marcas/forestal/oregon.png","/assets/marcas/forestal/Snapper.jpg"]});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
