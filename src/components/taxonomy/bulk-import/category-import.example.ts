export const CATEGORY_BULK_IMPORT_EXAMPLE = `{
  "items": [
    {
      "slug": "indoor-plants",
      "isActive": true,
      "translations": {
        "en": { "name": "Indoor Plants", "description": "Plants for home and office" },
        "bn": { "name": "ইনডোর উদ্ভিদ", "description": "বাড়ি ও অফিসের জন্য গাছ" }
      },
      "children": [
        {
          "slug": "foliage-plants",
          "isActive": true,
          "translations": {
            "en": { "name": "Foliage Plants" },
            "bn": { "name": "পাতার উদ্ভিদ" }
          }
        }
      ]
    }
  ]
}`;

export const CATEGORY_BULK_IMPORT_SESSION_KEY = "category-bulk-import-draft";
