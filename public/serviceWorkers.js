var CACHE_NAME = "budget-cache-v1";
var DATA_CACHE = "cache-v1";
var FILES_TO_CACHE =[
    "/",
    "/manifest.json",
    "/styles.css",
    "/index.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

self.addEventListener("fetch", (event) => {
    if(event.request.url.includes("/api/")) {
       event.respondWith(
        caches.open(DATA_CACHE)
        .then((cache) => {
            return fetch(event.request)
            .then(response => {
                if(response.status === 200) {
                    cache.put(event.request.url, response.clone())
                }
                return response;
            }).catch((err) => {
                return cache.match(event.request)
            })
        })
        
       )
       return
    }
    event.respondWith(
        fetch(event.request)
        .catch(() => {
            return caches.match(event.request)
            .then((response) => {
                if(response){
                    return response;
                }
                else if (event.request.headers.get("accept").includes("text/html")){
                    return caches.match("/")
                }
            })
        })
    )
})