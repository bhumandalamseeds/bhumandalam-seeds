(() => {
  const productIds = ["kds-753", "macs-1188", "kds-992", "kds-726", "ds-228", "ams-100-39", "macs-1281", "phule-rajmah", "bdn-711"];
  const cards = () => document.querySelectorAll("#pageProducts .grid > div");

  function addShareButtons() {
    let imageIndex = 0;
    cards().forEach(card => {
      const image = card.querySelector("img");
      const orderButton = card.querySelector("button[onclick^='buyOnWhatsApp']");
      if (!image || !orderButton || card.querySelector(".product-share-button")) return;
      card.id = `product-${productIds[imageIndex++] || imageIndex}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-share-button w-full mt-2 py-2 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl text-xs flex justify-center items-center space-x-2";
      button.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>WhatsApp \u0935\u0930 \u0936\u0947\u0905\u0930 \u0915\u0930\u093e</span>';
      button.addEventListener("click", () => shareProduct(card, image, button));
      orderButton.insertAdjacentElement("afterend", button);
    });
  }

  function shareText(card) {
    const title = card.querySelector("h3")?.innerText.trim() || "\u092d\u0942\u092e\u0902\u0921\u0932\u092e \u0938\u0940\u0921\u094d\u0938 \u0909\u0924\u094d\u092a\u093e\u0926\u0928";
    const description = card.querySelector("p")?.innerText.trim() || "";
    const price = card.querySelector(".font-extrabold")?.innerText.trim() || "";
    const purchaseUrl = new URL(window.location.pathname, window.location.origin).href;
    const purchaseLabel = "\u0916\u0930\u0947\u0926\u0940 \u0915\u0930\u0923\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u0932\u093f\u0902\u0915\u0935\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u093e:";
    const priceLabel = "\u0915\u093f\u0902\u092e\u0924:";
    const lines = [title, description, price ? `${priceLabel} ${price}` : "", `${purchaseLabel}\n${purchaseUrl}`].filter(Boolean);
    return { title, text: lines.join("\n\n") };
  }

  function openWhatsApp(text) {
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
  }

  async function shareProduct(card, image, button) {
    const label = button.querySelector("span");
    const originalLabel = label.textContent;
    const data = shareText(card);
    button.disabled = true;
    label.textContent = "\u0936\u0947\u0905\u0930 \u0909\u0918\u0921\u0924 \u0906\u0939\u0947\u2026";
    try {
      if (navigator.share && navigator.canShare) {
        const response = await fetch(new URL(image.currentSrc || image.src, window.location.href));
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
      label.textContent = originalLabel;
    }
  }

  document.addEventListener("DOMContentLoaded", addShareButtons);
})();
