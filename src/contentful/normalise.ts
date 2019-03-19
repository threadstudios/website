import {
  IComponent,
  ICleanEntry,
  IIncludes,
  IRichContentItem,
  IEntry,
  IContent
} from "./types";

module.exports = {
  "embedded-entry-block": function(item, includes) {
    const link = this.findAndMatchInclude(item.data.target, includes);
    if (!link) return null;
    return { c: link.ct, v: link.fields };
  },
  "heading-2": function(item) {
    return {
      c: "html",
      v: `<h2>${item.content.map(v => v.value).join("")}</h2>`
    };
  },
  paragraph: function(item) {
    const value = item.content.map(v => v.value).join("");
    return value ? { c: "html", v: `<p>${value}</p>` } : false;
  },
  contentItem: function(
    acc: Array<IComponent>,
    item: IContent,
    includes: Array<ICleanEntry>
  ) {
    let component: IComponent;
    if (item.nodeType && this[item.nodeType]) {
      component = this[item.nodeType](item, includes);
    } else {
      console.warn(`Not found: ${item.nodeType}`);
    }
    if (component) acc.push(component);
    return acc;
  },
  content: function(item: Array<IContent>, includes: Array<ICleanEntry>) {
    return item.reduce(
      (acc, item) => this.contentItem(acc, item, includes),
      []
    );
  },
  richContent: function(item: IRichContentItem, includes: Array<ICleanEntry>) {
    if (item.content) {
      return this.content(item.content, includes);
    } else {
      return this.content(item, includes);
    }
  },
  includes: function(includes: IIncludes) {
    let newIncludes = [];
    if (includes.Asset) newIncludes = newIncludes.concat(...includes.Asset);
    if (includes.Entry) newIncludes = newIncludes.concat(...includes.Entry);
    newIncludes = newIncludes.map(item => {
      return {
        id: item.sys.id,
        ct: item.sys.contentType ? item.sys.contentType.sys.id : false,
        fields: item.fields
      };
    });
    return newIncludes;
  },
  findAndMatchInclude: function(item: IEntry, includes: Array<ICleanEntry>) {
    return includes.find(inc => inc.id === item.sys.id);
  },
  embedIncludes: function(items: Array<IEntry>, includes: Array<ICleanEntry>) {
    return items.map(item => {
      for (let x in item.fields) {
        if (Array.isArray(item.fields[x])) {
          item.fields[x] = item.fields[x].map(childItem => {
            return this.findAndMatchInclude(childItem, includes).fields;
          });
        }
        if (typeof item.fields[x] === "object" && item.fields[x].sys) {
          item.fields[x] = this.findAndMatchInclude(
            item.fields[x],
            includes
          ).fields;
        }
      }
      return item;
    });
  },
  page: function(item, includes: IIncludes) {
    includes = this.embedIncludes(includes, includes);
    return {
      id: item.sys.id,
      url: item.fields.url,
      title: item.fields.title,
      components: this.richContent(item.fields.richContent, includes)
    };
  }
};
