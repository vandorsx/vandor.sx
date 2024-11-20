document.addEventListener("click", (e) => {
   const target = e.target as HTMLElement;
   if (target.matches("button[data-alt]")) {
      const altText = target.getAttribute("data-alt");
      if (altText) {
         alert(altText);
      }
   }
});
