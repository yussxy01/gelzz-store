const CONFIG = {
    storeName: "Gelzz Store", 
    ownerName: "Gelzz", 
    avatar: "image/logo/logo.jpg", 
    instagram: "",
    telegram: "",
    whatsappNumber: "6289507488866", 
    adminNumber: "6289507488866"
};

const banners = [
    "image/banner/banner1.jpg",
    "image/banner/banner2.jpg",
    "image/banner/banner3.jpg"
];

const products = [
    {
        id: 1,
        name: "APK Bug",
        image: "image/produk/produk1.jpg",
        desc: "",
        variants: [
            { id: "apk-bug", name: "APK Bug", price: 60000 }
        ]
    },
    {
        id: 2,
        name: "APK Bioskop",
        image: "image/produk/produk2.jpg",
        desc: "",
        variants: [
            { id: "apk-bioskop", name: "APK Bioskop", price: 4000 }
        ]
    },
    {
        id: 3,
        name: "Jasa Bug",
        image: "image/produk/produk3.jpg",
        desc: "",
        variants: [
            { id: "jasa-bug", name: "Jasa Bug", price: 5000 }
        ]
    },
    {
        id: 4,
        name: "Bot WA",
        image: "image/produk/produk4.jpg",
        desc: "",
        variants: [
            { id: "bot-wa", name: "Bot WA", price: 40000 }
        ]
    },
    {
        id: 5,
        name: "Nokos WA",
        image: "image/produk/produk5.jpg",
        desc: "",
        variants: [
            { id: "nokos-wa", name: "Nokos WA", price: 5000 }
        ]
    },
    {
        id: 6,
        name: "APK Fake Notice",
        image: "image/produk/produk6.jpg",
        desc: "",
        variants: [
            { id: "fake-notice", name: "APK Fake Notice", price: 10000 }
        ]
    },
    {
        id: 7,
        name: "Jasa Pemulihan WA",
        image: "image/produk/produk7.jpg",
        desc: "",
        variants: [
            { id: "pemulihan-wa", name: "Jasa Pemulihan WA", price: 10000 }
        ]
    },
    {
        id: 8,
        name: "TF Dana",
        image: "image/produk/produk8.jpg",
        desc: "",
        variants: [
            { id: "tf-dana", name: "TF Dana", price: 1000 }
        ]
    },
    {
        id: 9,
        name: "Jasa Kenon WA",
        image: "image/produk/produk9.jpg",
        desc: "",
        variants: [
            { id: "kenon-wa", name: "Jasa Kenon WA", price: 10000 }
        ]
    },
    {
        id: 10,
        name: "Web Blast WA",
        image: "image/produk/produk10.jpg",
        desc: "",
        variants: [
            { id: "web-blast-wa", name: "Web Blast WA", price: 6000 }
        ]
    }
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentProduct = null;
let bannerInterval = null;

function playSound() {
    const audio = document.getElementById("clickSound");
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

function addRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
}

document.addEventListener("click", function(e) {
    const target = e.target.closest(".product-card, .feature-item, .social-icon, .btn-buy, .btn-cart, .menu-btn, .cart-badge, .menu-item, .modal-close, .btn-confirm, .variant-option");
    if (target && !target.closest(".modal-overlay")) {
        playSound();
        addRipple(e, target);
    }
});

function updateCartCount() {
    document.getElementById("cartCount").innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function showToast(message) {
    let toast = document.querySelector(".toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast-notification";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function isPriceAsk(price) {
    return !price || price <= 0;
}

function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartCount();
    showToast(`${product.name} +1`);
}

function initBanner() {
    const container = document.getElementById("bannerSlider");
    if (!container) return;
    container.innerHTML = "";
    banners.forEach((src, idx) => {
        const slide = document.createElement("div");
        slide.className = "banner-slide";
        if (idx === 0) slide.classList.add("active");
        slide.innerHTML = `<img src="${src}" alt="banner" onerror="this.src='image/logo/logo.jpg'">`;
        container.appendChild(slide);
    });
    const dotsDiv = document.createElement("div");
    dotsDiv.className = "banner-dots";
    banners.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "banner-dot";
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => showBannerSlide(i));
        dotsDiv.appendChild(dot);
    });
    container.appendChild(dotsDiv);
    let current = 0;
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        current = (current + 1) % banners.length;
        showBannerSlide(current);
    }, 5000);
}

function showBannerSlide(index) {
    const slides = document.querySelectorAll(".banner-slide");
    const dots = document.querySelectorAll(".banner-dot");
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

function showProductDetail(product) {
    currentProduct = product;
    const modal = document.getElementById("productDetailModal");
    const content = document.getElementById("detailContent");
    const variants = product.variants || [];
    const allAsk = variants.length > 0 && variants.every(v => isPriceAsk(v.price));
    const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : parseFloat(product.price);

    let priceLabel = "";
    if (allAsk) {
        priceLabel = `<span style="color:#f59e0b; font-size:16px; font-weight:700;">Harga tanya admin</span>`;
    } else if (variants.length > 1) {
        priceLabel = `Mulai Rp ${minPrice.toLocaleString('id-ID')}`;
    } else {
        priceLabel = `Rp ${minPrice.toLocaleString('id-ID')}`;
    }

    content.innerHTML = `
        <img src="${product.image}" class="detail-image" onerror="this.src='image/logo/logo.jpg'">
        <div class="detail-title">${product.name}</div>
        <div class="detail-price">${priceLabel}</div>
        <div class="detail-desc">${product.desc || ""}</div>
        <div class="product-actions" style="margin-top:16px;">
            <button class="btn-buy" style="flex:1;" id="detailBuyBtn">Beli Sekarang</button>
            <button class="btn-cart" style="flex:1;" id="detailCartBtn"><i class="ri-add-line"></i> Keranjang</button>
        </div>
    `;
    modal.classList.add("open");
    document.getElementById("modalOverlay").classList.add("active");
    document.getElementById("detailBuyBtn").onclick = () => { closeDetail(); showVariantPicker(product, "buy"); };
    document.getElementById("detailCartBtn").onclick = () => { closeDetail(); showVariantPicker(product, "cart"); };
}

function closeDetail() {
    document.getElementById("productDetailModal").classList.remove("open");
    document.getElementById("modalOverlay").classList.remove("active");
}

function showVariantPicker(product, mode = "buy") {
    const modal = document.getElementById("productDetailModal");
    const content = document.getElementById("detailContent");
    const variants = product.variants || [];
    const hasVariants = variants.length > 0;
    const fallbackPrice = hasVariants ? variants[0].price : parseFloat(product.price);

    content.innerHTML = `
        <img src="${product.image}" class="detail-image" onerror="this.src='image/logo/logo.jpg'">
        <div class="detail-title">${product.name}</div>
        <div class="detail-price" id="variantPriceDisplay">${isPriceAsk(fallbackPrice) ? '<span style="color:#f59e0b;">Harga tanya admin</span>' : 'Rp ' + fallbackPrice.toLocaleString('id-ID')}</div>
        <div class="detail-desc">${product.desc || ""}</div>
        ${hasVariants ? `
            <div style="margin-top:16px;">
                <div style="font-size:13px; color:#8e95a5; margin-bottom:10px; font-weight:600;">Pilih Varian:</div>
                <div id="variantList" style="display:flex; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto;">
                    ${variants.map((v, i) => `
                        <button class="variant-option ${i === 0 ? "selected" : ""}" data-vidx="${i}"
                            style="display:flex; justify-content:space-between; align-items:center;
                            padding:12px 16px; border-radius:14px; cursor:pointer;
                            background:${i === 0 ? "#06b6d4" : "#1a1d24"}; border:1px solid ${i === 0 ? "#06b6d4" : "#2a2f38"};
                            color:white; font-size:14px; text-align:left; transition:0.2s;">
                            <span>${v.name}</span>
                            <strong>${isPriceAsk(v.price) ? 'Tanya Admin' : 'Rp ' + v.price.toLocaleString('id-ID')}</strong>
                        </button>
                    `).join("")}
                </div>
            </div>
        ` : ""}
        <div class="product-actions" style="margin-top:16px;">
            <button class="btn-buy" style="flex:1;" id="detailBuyBtn">
                ${mode === "cart" ? "Tambah ke Keranjang" : "Beli Sekarang"}
            </button>
        </div>
    `;

    modal.classList.add("open");
    document.getElementById("modalOverlay").classList.add("active");

    let selectedIdx = 0;

    document.querySelectorAll(".variant-option").forEach(btn => {
        btn.onclick = () => {
            selectedIdx = parseInt(btn.dataset.vidx);
            document.querySelectorAll(".variant-option").forEach((b, i) => {
                const isSel = i === selectedIdx;
                b.style.background = isSel ? "#06b6d4" : "#1a1d24";
                b.style.border = `1px solid ${isSel ? "#06b6d4" : "#2a2f38"}`;
                b.classList.toggle("selected", isSel);
            });
            const v = variants[selectedIdx];
            document.getElementById("variantPriceDisplay").innerHTML =
                isPriceAsk(v.price)
                    ? '<span style="color:#f59e0b;">Harga tanya admin</span>'
                    : "Rp " + v.price.toLocaleString('id-ID');
        };
    });

    document.getElementById("detailBuyBtn").onclick = () => {
        const chosen = hasVariants ? variants[selectedIdx] : null;
        const chosenPrice = chosen ? chosen.price : fallbackPrice;

        if (mode === "cart") {
            const cartItem = {
                id: chosen ? `${product.id}-${chosen.id}` : product.id,
                name: chosen ? `${product.name} - ${chosen.name}` : product.name,
                price: chosenPrice,
                image: product.image
            };
            addToCart(cartItem);
            closeDetail();
        } else {
            if (isPriceAsk(chosenPrice)) {
                askAdminViaWA(product, chosen);
                closeDetail();
            } else {
                const finalProduct = chosen
                    ? { name: `${product.name} - ${chosen.name}`, price: chosen.price }
                    : { name: product.name, price: fallbackPrice };
                showPayment(finalProduct);
                closeDetail();
            }
        }
    };
}

function askAdminViaWA(product, variant) {
    const name = variant ? `${product.name} - ${variant.name}` : product.name;
    const message = `Halo admin, saya ingin tanya harga untuk produk: ${name}. Mohon info harganya. Terima kasih.`;
    window.open(`https://wa.me/${CONFIG.adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

function showPayment(product) {
    currentProduct = product;
    const modal = document.getElementById("paymentModal");
    const content = document.getElementById("paymentContent");
    content.innerHTML = `
        <div style="text-align:center; padding: 0 10px;">
            <img src="image/qris.png" class="qris-image" onerror="this.src='https://placehold.co/320x320?text=QRIS'">
            <div style="font-size:20px; font-weight:700; margin-top:10px;">${product.name}</div>
            <div style="font-size:28px; font-weight:800; color:#22d3ee; margin:12px 0;">Rp ${product.price.toLocaleString('id-ID')}</div>
            <div class="payment-note">
                <i class="ri-alert-line"></i> WAJIB: Setelah transfer, kirim bukti screenshot ke admin untuk verifikasi.
            </div>
            <button class="btn-confirm" id="confirmWAButton">
                <i class="ri-whatsapp-line"></i> Konfirmasi via WhatsApp
            </button>
        </div>
    `;
    modal.classList.add("open");
    document.getElementById("modalOverlay").classList.add("active");
    document.getElementById("confirmWAButton").onclick = () => {
        const message = `Halo admin, saya ingin konfirmasi pembayaran untuk produk: ${product.name} dengan harga Rp ${product.price.toLocaleString('id-ID')}. Terima kasih.`;
        const url = `https://wa.me/${CONFIG.adminNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };
}

function closePayment() {
    document.getElementById("paymentModal").classList.remove("open");
    document.getElementById("modalOverlay").classList.remove("active");
}

function showCart() {
    const main = document.getElementById("mainContent");
    if (cart.length === 0) {
        main.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;">
                <i class="ri-shopping-cart-line" style="font-size: 80px; color: #8e95a5; margin-bottom: 20px;"></i>
                <p style="font-size: 16px; color: #8e95a5; margin-bottom: 24px;">Keranjang kosong</p>
                <button id="btnBackToShop" style="width: 200px; padding: 12px 24px; background: var(--accent); border: none; border-radius: 40px; color: white; font-weight: 600; cursor: pointer;">Kembali Belanja</button>
            </div>
        `;
        const backBtn = document.getElementById("btnBackToShop");
        if (backBtn) {
            backBtn.onclick = function(e) {
                e.stopPropagation();
                renderHome();
            };
        }
        return;
    }
    
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const hasAskPrice = cart.some(i => isPriceAsk(i.price));
    main.innerHTML = `
        <div style="padding:20px 0;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                <i class="ri-arrow-left-line" id="backHomeFromCart" style="font-size:24px; cursor:pointer;"></i>
                <h2 style="font-size:20px;">Keranjang Belanja</h2>
            </div>
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <div><strong>${item.name}</strong><br><small>${isPriceAsk(item.price) ? '<span style="color:#f59e0b;">Tanya Admin</span>' : 'Rp ' + item.price.toLocaleString('id-ID')}</small></div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button class="cart-qty-minus" data-id="${item.id}" style="background:#2a2f38; border:none; width:32px; height:32px; border-radius:16px; cursor:pointer; font-size:16px; color:white;">-</button>
                            <span style="min-width:24px; text-align:center;">${item.qty}</span>
                            <button class="cart-qty-plus" data-id="${item.id}" style="background:#2a2f38; border:none; width:32px; height:32px; border-radius:16px; cursor:pointer; font-size:16px; color:white;">+</button>
                            <button class="cart-remove" data-id="${item.id}" style="background:#dc2626; border:none; width:32px; height:32px; border-radius:16px; cursor:pointer; color:white;"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">Total: ${hasAskPrice ? '<span style="color:#f59e0b;">Sebagian produk tanya admin</span>' : 'Rp ' + total.toLocaleString('id-ID')}</div>
            <button class="btn-buy" id="checkoutFromCart" style="width:100%; padding:14px;">Checkout Semua</button>
            <button id="backToShopBtn" style="width:100%; padding:14px; margin-top:12px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:40px; color:white; cursor:pointer;">Kembali Belanja</button>
        </div>
    `;
    
    document.getElementById("backHomeFromCart")?.addEventListener("click", () => renderHome());
    document.getElementById("backToShopBtn")?.addEventListener("click", () => renderHome());
    
    document.querySelectorAll(".cart-qty-minus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const item = cart.find(i => String(i.id) === String(id));
            if (item) {
                if (item.qty > 1) item.qty--;
                else cart = cart.filter(i => String(i.id) !== String(id));
                updateCartCount();
                showCart();
            }
        });
    });
    
    document.querySelectorAll(".cart-qty-plus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const item = cart.find(i => String(i.id) === String(id));
            if (item) {
                item.qty++;
                updateCartCount();
                showCart();
            }
        });
    });
    
    document.querySelectorAll(".cart-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            cart = cart.filter(i => String(i.id) !== String(id));
            updateCartCount();
            showCart();
        });
    });
    
    document.getElementById("checkoutFromCart")?.addEventListener("click", () => {
        const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const productList = cart.map(i => `${i.name} x${i.qty}`).join(", ");
        const hasAsk = cart.some(i => isPriceAsk(i.price));

        if (hasAsk) {
            const message = `Halo admin, saya ingin checkout: ${productList}. Ada produk yang harganya perlu dikonfirmasi. Mohon info total dan panduan pembayaran. Terima kasih.`;
            window.open(`https://wa.me/${CONFIG.adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
            return;
        }

        const modal = document.getElementById("paymentModal");
        const content = document.getElementById("paymentContent");
        content.innerHTML = `
            <div style="text-align:center; padding: 0 10px;">
                <img src="image/qris.png" class="qris-image" onerror="this.src='https://placehold.co/320x320?text=QRIS'">
                <div style="font-size:18px; font-weight:700; margin-top:10px;">Checkout Keranjang</div>
                <div style="font-size:13px; color:#8e95a5; margin:8px 0; word-break:break-word;">${productList}</div>
                <div style="font-size:28px; font-weight:800; color:#22d3ee; margin:12px 0;">Rp ${totalPrice.toLocaleString('id-ID')}</div>
                <div class="payment-note">
                    <i class="ri-alert-line"></i> WAJIB: Setelah transfer, kirim bukti screenshot ke admin untuk verifikasi.
                </div>
                <button class="btn-confirm" id="confirmCheckoutWAButton">
                    <i class="ri-whatsapp-line"></i> Konfirmasi via WhatsApp
                </button>
            </div>
        `;
        modal.classList.add("open");
        document.getElementById("modalOverlay").classList.add("active");
        
        document.getElementById("confirmCheckoutWAButton").onclick = () => {
            const message = `Halo admin, saya ingin checkout: ${productList} dengan total Rp ${totalPrice.toLocaleString('id-ID')}. Mohon panduan pembayaran.`;
            window.open(`https://wa.me/${CONFIG.adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
            document.getElementById("paymentModal").classList.remove("open");
            document.getElementById("modalOverlay").classList.remove("active");
            cart = [];
            updateCartCount();
            renderHome();
            showToast("Checkout berhasil, terima kasih!");
        };
    });
}

function showGuide() {
    const main = document.getElementById("mainContent");
    main.innerHTML = `
        <div style="padding:20px 0;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                <i class="ri-arrow-left-line" id="backHomeGuide" style="font-size:24px; cursor:pointer;"></i>
                <h2 style="font-size:20px;">Panduan Belanja</h2>
            </div>
            <div style="background:#1a1d24; border-radius:24px; padding:24px;">
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">1</span> Pilih produk yang ingin dibeli</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">2</span> Klik "Beli Sekarang" atau tambah ke keranjang, lalu pilih varian</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">3</span> Scan QRIS dan lakukan pembayaran sesuai nominal</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">4</span> Klik "Konfirmasi via WhatsApp" dan kirim bukti transfer</div>
                <div><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">5</span> Produk akan dikirim dalam 2-15 menit setelah verifikasi</div>
            </div>
        </div>
    `;
    document.getElementById("backHomeGuide")?.addEventListener("click", () => renderHome());
}

function renderHome() {
    const main = document.getElementById("mainContent");
    main.innerHTML = `
        <div class="profile-section">
            <img src="${CONFIG.avatar}" class="profile-avatar" onerror="this.src='image/logo/logo.jpg'">
            <div class="profile-info">
                <h2>${CONFIG.storeName}</h2>
                <p><span class="status-badge"></span> Online & Terpercaya</p>
                <div class="social-links">
                    <a href="${CONFIG.instagram}" target="_blank" class="social-icon"><i class="ri-instagram-line"></i></a>
                    <a href="${CONFIG.telegram}" target="_blank" class="social-icon"><i class="ri-telegram-line"></i></a>
                    <a href="https://wa.me/${CONFIG.whatsappNumber}" target="_blank" class="social-icon"><i class="ri-whatsapp-line"></i></a>
                </div>
            </div>
        </div>
        <div class="banner-slider" id="bannerSlider"></div>
        <div class="marquee">
            <div class="marquee-text">PROMO SPESIAL CASHBACK 10 UNTUK PEMBELIAN PERTAMA   GARANSI 100 AMAN   LAYANAN 24 JAM   HUBUNGI ADMIN JIKA ADA KENDALA</div>
        </div>
        <div class="section-title"><i class="ri-shopping-bag-3-line"></i> Produk Kami</div>
        <div class="products-grid" id="productsGrid"></div>
        <div class="feature-grid">
            <div class="feature-item"><i class="ri-flashlight-line feature-icon"></i><div class="feature-text"><h5>Proses Cepat</h5><p>2-5 menit</p></div></div>
            <div class="feature-item"><i class="ri-shield-check-line feature-icon"></i><div class="feature-text"><h5>Garansi 100</h5><p>Refund jika gagal</p></div></div>
            <div class="feature-item"><i class="ri-customer-service-2-line feature-icon"></i><div class="feature-text"><h5>Support 24/7</h5><p>Admin siap bantu</p></div></div>
        </div>
        <div class="promo-card"><h4>PROMO CASHBACK 10</h4><p>Khusus pengguna baru transaksi pertama</p><i class="ri-discount-line promo-deco"></i></div>
    `;

    const grid = document.getElementById("productsGrid");
    grid.innerHTML = products.map(p => {
        const variants = p.variants || [];
        const allAsk = variants.length > 0 && variants.every(v => isPriceAsk(v.price));
        const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : parseFloat(p.price);

        let priceLabel;
        if (allAsk) {
            priceLabel = `<span style="color:#f59e0b; font-size:13px; font-weight:700;">Harga tanya admin</span>`;
        } else if (variants.length > 1) {
            priceLabel = `Mulai Rp ${minPrice.toLocaleString('id-ID')}`;
        } else {
            priceLabel = `Rp ${minPrice.toLocaleString('id-ID')}`;
        }

        return `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.image}" class="product-image" onerror="this.src='image/logo/logo.jpg'">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${priceLabel}</div>
            <div class="product-actions">
                <button class="btn-buy" data-id="${p.id}">Beli</button>
                <button class="btn-cart" data-id="${p.id}"><i class="ri-add-line"></i> Keranjang</button>
            </div>
        </div>
        `;
    }).join("");

    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-buy") || e.target.classList.contains("btn-cart")) return;
            const id = parseInt(card.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showProductDetail(product);
        });
    });

    document.querySelectorAll(".btn-buy").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showVariantPicker(product, "buy");
        });
    });

    document.querySelectorAll(".btn-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showVariantPicker(product, "cart");
        });
    });

    initBanner();
}

function initMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("menuSidebar");
    const overlay = document.getElementById("modalOverlay");
    const closeMenu = document.getElementById("closeMenu");
    
    function openMenu() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
    }
    
    function closeMenuPanel() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }
    
    menuBtn.addEventListener("click", openMenu);
    closeMenu.addEventListener("click", closeMenuPanel);
    overlay.addEventListener("click", closeMenuPanel);
    
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => {
            const nav = item.dataset.nav;
            if (nav === "home") renderHome();
            else if (nav === "cart") showCart();
            else if (nav === "guide") showGuide();
            closeMenuPanel();
            document.getElementById("storeNameHeader").innerText = CONFIG.storeName;
        });
    });
}

function initModals() {
    document.getElementById("closeDetail").addEventListener("click", closeDetail);
    document.getElementById("closePayment").addEventListener("click", closePayment);
    
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
        cartBadge.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            showCart();
        });
    }
}

document.getElementById("storeNameHeader").innerText = CONFIG.storeName;
renderHome();
initMenu();
initModals();
updateCartCount();