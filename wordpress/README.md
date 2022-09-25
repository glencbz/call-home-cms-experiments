# WordPress

## Key observations 

From experimenting with UI using Docker Compose

- Really simple, streamlined process for creating posts and setting up layouts
- REST API is available at `/wp-json`. Seems to be a full HATEOAS API, which
  might be a useful property.
- You can permalink posts and view them via the "slug" query param
http://localhost/wp-json/wp/v2/posts?slug=test-content
- Default permalink has date in it, but you can modify the format
http://localhost/2022/09/25/test-content?rest_route=/wp/v2
- Not seeing an obvious way to use WP to modify the set of strings.
  - Maybe use a single WP post per screen per locale. Each WP post uses some
    well-formatted string that the FE can parse.
- Didn't test "media", but that should be a non-issue.
- User auth seems well-supported - each author can only modify their own posts
