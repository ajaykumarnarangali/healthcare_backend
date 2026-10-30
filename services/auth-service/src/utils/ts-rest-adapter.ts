export function callController(controller: Function) {
    return async (r: any) => {
        const request = {
            query: r.req.query,
            body: r.body,
            params: r.req.params,
            user: r.req.user,
            raw: r.req,
            file: r.req.file
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
            user: r.req.user,
            raw: r.req,
            file: r.req.file
        };

        return controller(request, r.res);
    };
}