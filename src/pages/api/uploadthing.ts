import { createRouteHandler } from "uploadthing/next-legacy";

import { ourFileRouter } from "~/server/uploadthing";

export default createRouteHandler({
    router: ourFileRouter,

    // Apply an (optional) custom config:
    // config: { ... },
});/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

