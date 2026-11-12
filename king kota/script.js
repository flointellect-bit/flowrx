 // ===============================================
// PLEASE CONFIGURE YOUR UNIQUE API ID'S RIGHT HERE:
// ===============================================
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID"; // E.g., formspree.io/f/mqoqpwy

const PAYFAST_MERCHANT_ID = "10000100";  // REPLACE with your live Merchant ID 
const PAYFAST_MERCHANT_KEY = "46f0cd694581a"; // REPLACE with your Live Merchant Key
// ===============================================

document.addEventListener('DOMContentLoaded', () => {

  const bodyEl = document.body;
  if(localStorage.getItem("kotas-theme") === 'light') bodyEl.setAttribute("data-theme", "light");

  document.getElementById('themeToggle').addEventListener("click", () => {
    let currentTheme = bodyEl.getAttribute("data-theme");
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    bodyEl.setAttribute("data-theme", newTheme);
    localStorage.setItem("kotas-theme", newTheme);
  });

  // CART LOGIC
  let cart =[];
  const cartBadge = document.getElementById("cartBadge");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotalValue = document.getElementById("cartTotalValue");

  window.toggleCart = function() {
    cartSidebar.classList.toggle("open");
    cartOverlay.classList.toggle("open");
  }

  window.addToCart = function(itemName, itemPrice) {
    const existingItem = cart.find(obj => obj.name === itemName);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ name: itemName, price: itemPrice, qty: 1 });
    }
    updateCartUI();
    cartBadge.parentElement.style.transform = 'scale(1.3)';
    setTimeout(() => { cartBadge.parentElement.style.transform = 'scale(1)'; }, 200);
  }

  window.changeQty = function(index, amount) {
    cart[index].qty += amount;
    if (cart[index].qty <= 0) cart.splice(index, 1); 
    updateCartUI();
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your basket is empty. Add some fire food!</div>';
      document.getElementById("checkoutBtn").disabled = true;
    } else {
      document.getElementById("checkoutBtn").disabled = false;
      checkOperatingHours(); 
      
      cart.forEach((item, index) => {
        totalItems += item.qty;
        totalPrice += (item.price * item.qty);
        cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <div class="cart-item-details">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">R${item.price} x ${item.qty} = <strong>R${item.price * item.qty}</strong></span>
            </div>
            <div class="cart-item-actions">
              <button class="cart-btn" onclick="changeQty(${index}, -1)">-</button>
              <span style="font-weight:bold; width:20px; text-align:center;">${item.qty}</span>
              <button class="cart-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
          </div>
        `;
      });
    }
    cartBadge.textContent = totalItems;
    cartTotalValue.textContent = 'R' + totalPrice;
  }

  // ==========================================
  // SILENT EMAIL & SECURE PAYFAST TRANSFER
  // ==========================================
  window.processCheckout = async function() {
    const custName = document.getElementById("custName").value.trim();
    const custPhone = document.getElementById("custPhone").value.trim();
    const checkoutBtn = document.getElementById("checkoutBtn");

    if(!custName || !custPhone) {
      alert("⚠️ Please enter your name and phone number to complete the order.");
      return;
    }

    let totalToPay = 0;
    let itemsText = "🛍️ ORDER ITEMS:\n--------------------\n";
    cart.forEach(item => {
      totalToPay += (item.price * item.qty);
      itemsText += `🔸 ${item.qty}x ${item.name} = R${item.price * item.qty}\n`;
    });

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Processing Checkout...";

    // STEP 1: Secretly Ping you an email detailing the exact pending request BEFORE payment redirection happens.
    // So you have visual preparation insight as their order rings via FormSpree. 
    try {
      const emailPayload = {
        _subject: `New pending R${totalToPay} order from ${custName}`,
        Name: custName,
        Phone: custPhone,
        Total: `R${totalToPay}`,
        Status: "PENDING. 🚨 (Do not cook yet. Wait to confirm proof of payment in your PayFast inbox).",
        Collection_From: "Protea Glen, Soweto Store",
        Order_List: itemsText
      };

      // We bypass usual "new tab open" functionality to just securely post text and disappear invisible 
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });
    } catch (e) {
      console.log("Email dispatch failure caught silently, attempting PayFast Redirect anyways");
    }

    // STEP 2: Assemble exact format request needed to talk to SA PayFast.
    const pfForm = document.createElement('form');
    // For testing use: 'sandbox.payfast.co.za/eng/process' . 
    // Live mode must always equal: 'www.payfast.co.za/eng/process'
    pfForm.action = "https://www.payfast.co.za/eng/process"; 
    pfForm.method = "POST";
    
    // Fill all required Merchant data bindings to Payfast Form Parameters array object
    const pfParams = {
      merchant_id: PAYFAST_MERCHANT_ID, 
      merchant_key: PAYFAST_MERCHANT_KEY, 
      return_url: window.location.href, // Immediately shoots user right back onto original menu website upon finishing check out properly
      cancel_url: window.location.href, // Handles manual cancellations directly onto site  
      amount: totalToPay.toFixed(2), // Convert integer 40 safely into required SA bank bounds -> "40.00" string payload  
      item_name: "Fresh Kotas - " + custName // Creates name header so client statements makes contextual sense 
    };

    // Cycle variables correctly attaching values universally underneath invisble node frame.
    for (const propertyCode in pfParams) {
      const inputLine = document.createElement('input');
      inputLine.type = 'hidden';
      inputLine.name = propertyCode;
      inputLine.value = pfParams[propertyCode];
      pfForm.appendChild(inputLine);
    }
    
    // Throw invisible request onto view instantly trigger push out via HTML spec function execute calls. 
    document.body.appendChild(pfForm);
    pfForm.submit(); 
  }

  // ==========================================
  // TIMED OPERATING RESTRICTIONS
  // ==========================================
  const checkOperatingHours = () => {
    const options = { timeZone: 'Africa/Johannesburg', hour: 'numeric', minute: 'numeric', hour12: false };
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date());
    let currentHour = parseInt(parts.find(p => p.type === 'hour').value, 10);
    let currentMinute = parseInt(parts.find(p => p.type === 'minute').value, 10);
    
    let currentTotalMinutes = (currentHour * 60) + currentMinute;
    const openTimeMinutes = 525;  // 08:45 AM
    const closeTimeMinutes = 1250; // 20:50 PM
    const isOpen = (currentTotalMinutes >= openTimeMinutes) && (currentTotalMinutes <= closeTimeMinutes);
    
    const cartCheckoutBtn = document.getElementById("checkoutBtn");
    const cartClosedAlert = document.getElementById("closedMessage");
    
    if (!isOpen) {
      if(cartCheckoutBtn) {
        cartCheckoutBtn.disabled = true;
        cartCheckoutBtn.textContent = "Store is Currently Closed";
        cartCheckoutBtn.classList.add("disabled-btn");
      }
      if(cartClosedAlert) cartClosedAlert.style.display = "block";
    } else {
      if(cartCheckoutBtn && cart.length > 0) {
        cartCheckoutBtn.disabled = false;
        cartCheckoutBtn.textContent = "Proceed to PayFast & Place Order";
        cartCheckoutBtn.classList.remove("disabled-btn");
      }
      if(cartClosedAlert) cartClosedAlert.style.display = "none";
    }
  };

  checkOperatingHours();
  setInterval(checkOperatingHours, 30000); 

});