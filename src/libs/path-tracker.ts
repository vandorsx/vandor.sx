const pagesWithQueryParams: string[] = ["/microblog"];

function initializePathTracker() {
   if (!sessionStorage.getItem("path-stack")) {
      sessionStorage.setItem("path-stack", JSON.stringify([]));
   }
   updatePathStack(getFullPath());
}

function getFullPath(): string {
   const pathname = window.location.pathname;

   if (pagesWithQueryParams.includes(pathname)) {
      return pathname + window.location.search;
   } else {
      return pathname;
   }
}

function updatePathStack(newPath: string) {
   try {
      const pathStack: string[] = JSON.parse(
         sessionStorage.getItem("path-stack") || "[]",
      );
      const currentPath: string | null = pathStack[pathStack.length - 1];

      if (currentPath !== newPath) {
         pathStack.push(newPath);
      }

      sessionStorage.setItem("path-stack", JSON.stringify(pathStack));
   } catch (e: unknown) {
      console.error("Error updating path stack:", e);
   }
}

function trackPath() {
   try {
      const path = getFullPath();
      updatePathStack(path);
   } catch (e) {
      console.error("Error tracking path:", e);
   }
}

function handlePopState() {
   try {
      const pathStack: string[] = JSON.parse(
         sessionStorage.getItem("path-stack") || "[]",
      );
      if (pathStack.length > 1) {
         pathStack.pop();
      }
      sessionStorage.setItem("path-stack", JSON.stringify(pathStack));
   } catch (e) {
      console.error("Error handling popstate:", e);
   }
}

initializePathTracker();

function addSafeEventListener(
   event: string,
   handler: EventListenerOrEventListenerObject,
) {
   const eventFlag: string = `has${event}Listener`;
   if (!(eventFlag in window)) {
      window.addEventListener(event, handler);
      (window as any)[eventFlag] = true;
   }
}

addSafeEventListener("popstate", () => {
   handlePopState();
   trackPath();
});
addSafeEventListener("pageshow", trackPath);

const originalPushState = history.pushState;
history.pushState = function (...args: [any, string, (string | null)?]) {
   originalPushState.apply(this, args);
   trackPath();
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args: [any, string, (string | null)?]) {
   originalReplaceState.apply(this, args);
   trackPath();
};
