document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const tapBtn = document.getElementById("tap-button");
  const countDisplay = document.getElementById("tap-count");
  const checkBtn = document.getElementById("check-subscription");
  const leaderboardEl = document.getElementById("leaderboard");

  let points = parseInt(localStorage.getItem("tap_points")) || 0;
  let bonusGiven = localStorage.getItem("bonus_given") === "true";

  function updatePointsDisplay() {
    countDisplay.textContent = `Очков: ${points}`;
  }

  function savePoints() {
    localStorage.setItem("tap_points", points);
    updateLeaderboard();
  }

  tapBtn.addEventListener("click", () => {
    points++;
    savePoints();
    updatePointsDisplay();
  });

  checkBtn.addEventListener("click", async () => {
    if (bonusGiven) {
      alert("Бонус уже получен!");
      return;
    }

    try {
      const result = await fetch(`https://api.telegram.org/bot<8070571080:AAG6XVuACw1dIwgz8n2kN4LtP19FqmYrd9w>/getChatMember?chat_id=@alfabank_mobile&user_id=${tg.initDataUnsafe.user.id}`);
      const data = await result.json();

      if (data.result.status === "member" || data.result.status === "administrator" || data.result.status === "creator") {
        points += 200;
        bonusGiven = true;
        localStorage.setItem("bonus_given", "true");
        savePoints();
        updatePointsDisplay();
        alert("Бонус получен!");
      } else {
        alert("Подпишитесь на канал, чтобы получить бонус.");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка проверки подписки");
    }
  });

  function updateLeaderboard() {
    let users = JSON.parse(localStorage.getItem("leaderboard") || "[]");

    const currentUser = {
      id: tg.initDataUnsafe.user.id,
      name: tg.initDataUnsafe.user.first_name,
      points,
    };

    users = users.filter(u => u.id !== currentUser.id);
    users.push(currentUser);
    users.sort((a, b) => b.points - a.points);
    localStorage.setItem("leaderboard", JSON.stringify(users));

    leaderboardEl.innerHTML = users
      .slice(0, 5)
      .map(u => `<li>${u.name}: ${u.points}</li>`)
      .join("");
  }

  updatePointsDisplay();
  updateLeaderboard();
});
