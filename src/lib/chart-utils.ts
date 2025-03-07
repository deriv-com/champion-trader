export const moduleLoader = (
    lazyComponent: () => Promise<unknown>,
    attempts = 2,
    interval = 1500
) => {
    return new Promise((resolve, reject) => {
        lazyComponent()
            .then(resolve)
            .catch((error: unknown) => {
                // let us retry after 1500 ms
                setTimeout(() => {
                    if (attempts === 1) {
                        reject(error);
                        return;
                    }
                    moduleLoader(lazyComponent, attempts - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
};

export const getUrlBase = (path = "") => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split("/")[1]}${/^\//.test(path) ? path : `/${path}`}`;
};
