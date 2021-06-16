import { Home } from "./page/Home.tsx";
import { About } from "./page/About.tsx";

export const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
    seo: {
      title: "Welcome to home",
      description: "This description sample for page Home",
    },
  },
  {
    path: "/about",
    component: About,
    seo: {
      title: "Welcome to about",
      description: "This description sample for page about",
    },
  },
];
