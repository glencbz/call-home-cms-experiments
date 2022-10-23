# Strapi

## How to use demo

```sh
(cd glen-frontend && npm start)
(cd npx-backend && npm run develop)
```

### Manual Strapi Steps

- 'Content Manager' > 'law-soc': fill out the fields 'title' and 'subtitle'
- 'Settings' > 'Roles' > 'public' > 'law-soc': check the 'find' permission
- 'Settings' > 'Internationalization': click 'Add new locale' and
  add the 'Bengali (Bangladesh) (bn-BD)' locale.
- 'Content Manager' > 'law-soc': select the bn-BD from 'Locales' and
  fill out the fields 'title'. Leave 'subtitle' unfilled to see the fallback
  from the default locale.

## Key observations 

- API is easy to access
- Intuitive to build categories
- https://strapi.io/features/internationalization is an easy win for i18n
- 5 stars, this looks great.
