export const TAG_BULK_IMPORT_EXAMPLE = `{
  "groups": [
    {
      "slug": "light-requirement",
      "isActive": true,
      "translations": {
        "en": { "name": "Light requirement", "description": "How much light the plant needs" },
        "bn": { "name": "আলোর প্রয়োজনীয়তা", "description": "গাছের আলোর চাহিদা" }
      },
      "tags": [
        {
          "slug": "low-light",
          "isActive": true,
          "translations": {
            "en": { "name": "Low light" },
            "bn": { "name": "কম আলো" }
          }
        },
        {
          "slug": "bright-indirect",
          "translations": {
            "en": { "name": "Bright indirect" },
            "bn": { "name": "উজ্জ্বল পরোক্ষ আলো" }
          }
        }
      ]
    }
  ]
}`;

export const TAG_BULK_IMPORT_SESSION_KEY = "tag-bulk-import-draft";
