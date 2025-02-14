import { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import { BlogPostRecord } from "@levelcrush/blog/blog_post";
import { client } from "@sanity-cms/lib/client";
import { CMSPageRecord } from "./cms_page";
import { MenuRecord } from "@levelcrush/menu";

export async function blog(slug: string) {
  const posts = (await client.fetch(
    `*[_type == "post" && slug.current == $slug] {
        _id,
        title,
        "image": image.asset->,
        "slug": slug.current,
        body,
        publishedAt,
        _createdAt,
        _updatedAt
        }`,
    { slug: slug }
  )) as BlogPostRecord[];

  const post = (posts || []).at(0);
  return post;
}

export async function blogPaginate(
  start: number = 0,
  end: number = 9,
  sort: "asc" | "desc" = "desc"
) {
  const latestPost = (await client.fetch(`
            *[_type == "post"] | order(publishedAt ${sort})[${start}..${end}] {
              _id,
              title,
              "image": image.asset->,
              "slug": slug.current,
              shortBody,
              publishedAt,
              _createdAt,
              _updatedAt
            }`)) as BlogPostListingRecord[] | null | undefined;
  return latestPost;
}

export async function page(route: string = "/") {
  const pages = (await client.fetch(
    `*[_type == "page" && route.current == $route] 
      {
          title,
          id, 
          metaDescription,
          tabName,
          "hero" : hero.asset->url,
          "categories": categories[] {
                  _type == 'reference' => @-> {
                      title,
                  } ,
              },  
          "route" : route.current,
          "template" : template-> { "slug": slug.current, metadata },
          body
      }`,
    {
      route,
    }
  )) as CMSPageRecord[] | null | undefined;

  const page = (pages || []).at(0);
  return page;
}

export async function menu(id: string = "") {
  const menu = (await client.fetch(
    `
    *[ _type == "menu" && slug.current == $menu][0] {
      title,
      url, 
      "loginOnly": coalesce(loginOnly, false),
      "slug" : slug.current, 
      "links": *[ _type == "menu-link" && parent._ref  == ^._id && visible == true] | order(order asc) {
        title, 
        url,
        "id" : id.current,
        order,
        "loginOnly": coalesce(loginOnly, false),
      },
      "submenus" : * [ _type == "menu" && parent._ref == ^._id && visible == true] | order(order asc) {
          title,
          url, 
          "slug" : slug.current, 
          "links": *[ _type == "menu-link" && parent._ref  == ^._id && visible == true] | order(order asc) {
            title, 
            url,
            "id" : id.current,
            order,
            "loginOnly": coalesce(loginOnly, false),
          },
          "submenus" : [],
          order,
          "loginOnly": coalesce(loginOnly, false),
      }
    }
    `,
    {
      menu: id,
    }
  )) as MenuRecord | null;

  return menu;
}

export const cms = {
  blog,
  blogPaginate,
  page,
  menu,
};

export default cms;
