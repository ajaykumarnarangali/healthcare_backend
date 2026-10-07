export function callController(controller: Function) {
    return async (r: any) => {
        const request = {
            query: r.req.query,
            body: r.body,
            params: r.req.params,
            // ctx: r.ctx,
            raw: r.req,
        };

        return controller(request);
    };
}

export function callControllerWithResponse(controller: Function) {
    return async (r: any) => {
        const request = {
            query: r.req.query,
            body: r.body,
            params: r.req.params,
            // ctx: r.ctx,
            raw: r.req,
        };

        return controller(request, r.res);
    };
}