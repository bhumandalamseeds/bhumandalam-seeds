(() => {
  const cards = () => document.querySelectorAll("#pageProducts .grid > div");
  function addShareButtons() {
    cards().forEach(card => {
      const image = card.querySelector("img");
      const orderButton = card.querySelector("button[onclick^='buyOnWhatsApp']");
      if (!image || !orderButton || card.querySelector(".product-share-button")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-share-button w-full mt-2 py-2 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl text-xs flex justify-center items-center space-x-2";
      button.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>WhatsApp वर शेअर करा</span>';
      button.addEventListener("click", () => shareProduct(card, image, button));
      orderButton.insertAdjacentElement("afterend", button);
    });
  }

  function shareText(card, image) {
    const title = card.querySelector("h3")?.innerText.trim() || "भूमंडलम सीड्स उत्पादन";
    const description = card.querySelector("p")?.innerText.trim() || "";
    const price = card.querySelector(".font-extrabold")?.innerText.trim() || "";
    const imageUrl = new URL(image.currentSrc || image.src, window.location.href).href;
    const lines = [title, description, price ? `किंमत: ${price}` : "", `फोटो: ${imageUrl}`, `वेबसाइट: ${window.location.href}`].filter(Boolean);
    return { title, text: lines.join("\n\n"), imageUrl };
  }

  function openWhatsApp(text) {
    const url = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function shareProduct(card, image, button) {
    const originalLabel = button.querySelector("span").textContent;
    const data = shareText(card, image);
    button.disabled = true;
    button.querySelector("span").textContent = "शेअर उघडत आहे…";
    try {
      if (navigator.share && navigator.canShare) {
        const response = await fetch(data.imageUrl);
        if (!response.ok) throw new Error("Image unavailable");
        const blob = await response.blob();
        const extension = blob.type.split("/")[1] || "jpg";
        const file = new File([blob], `bhumandalam-product.${extension}`, { type: blob.type || "image/jpeg" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: data.title, text: data.text, files: [file] });
          return;
        }
      }
      openWhatsApp(data.text);
    } catch (error) {
      if (error?.name !== "AbortError") openWhatsApp(data.text);
    } finally {
      button.disabled = false;
      button.querySelector("span").textContent = originalLabel;
    }
  }

  document.addEventListener("DOMContentLoaded", addShareButtons);
})();

