import language from "./LanguageList";
export default async function detectLang(ext) {
  for (const lang in language) {
    if (ext == lang) {
      return language[lang];
    }
  }
}
