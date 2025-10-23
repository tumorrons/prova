<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Piano Alimentare</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding-bottom: 70px;
        }

        .header {
            background: #FF8C42;
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .header h1 {
            font-size: 1.2em;
            font-weight: 500;
        }

        .calendar-strip {
            background: white;
            padding: 15px 10px;
            display: flex;
            justify-content: space-around;
            border-bottom: 1px solid #e0e0e0;
        }

        .calendar-day {
            text-align: center;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .calendar-day.active {
            background: #FF8C42;
            color: white;
        }

        .day-label {
            font-size: 0.85em;
            color: #666;
            margin-bottom: 5px;
        }

        .calendar-day.active .day-label {
            color: white;
        }

        .day-number {
            font-size: 1.4em;
            font-weight: 500;
        }

        .content {
            padding: 20px;
        }

        .day-section {
            display: none;
        }

        .day-section.active {
            display: block;
        }

        .day-title {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .meal-section {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .meal-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
        }

        .meal-icon {
            font-size: 2em;
        }

        .meal-title {
            font-size: 1.1em;
            font-weight: 600;
            color: #333;
        }

        .meal-content {
            margin-left: 55px;
        }

        .add-meal-btn {
            background: white;
            border: 2px dashed #FF8C42;
            color: #FF8C42;
            padding: 12px;
            border-radius: 8px;
            width: 100%;
            cursor: pointer;
            font-size: 1em;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s;
        }

        .add-meal-btn:hover {
            background: #fff5f0;
        }

        .meal-item {
            background: #fff5f0;
            border: 1px solid #FFD4B3;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 8px;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .meal-photo-small {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
        }

        .meal-info-inline {
            flex: 1;
        }

        .meal-name {
            font-weight: 600;
            color: #333;
        }

        .meal-details {
            font-size: 0.85em;
            color: #666;
        }

        .delete-icon {
            color: #FF8C42;
            cursor: pointer;
            font-size: 1.2em;
        }

        .snack-btn {
            background: transparent;
            border: none;
            color: #FF8C42;
            padding: 10px;
            cursor: pointer;
            font-size: 1em;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 40px;
        }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
        }

        .nav-item {
            text-align: center;
            color: #999;
            cursor: pointer;
            flex: 1;
            padding: 5px;
        }

        .nav-item.active {
            color: #FF8C42;
        }

        .nav-icon {
            font-size: 1.5em;
            margin-bottom: 3px;
        }

        .nav-label {
            font-size: 0.75em;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 25px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }

        .modal-title {
            font-size: 1.3em;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }

        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
        }

        .photo-upload-area {
            border: 2px dashed #FF8C42;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            background: #fff5f0;
        }

        .photo-upload-area:hover {
            background: #ffe8d9;
        }

        .preview-img {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin-top: 10px;
        }

        .btn-primary {
            background: #FF8C42;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            margin-right: 10px;
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #666;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
        }

        .week-view {
            display: none;
        }

        .week-view.active {
            display: block;
        }

        .week-summary {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .summary-total {
            text-align: center;
            margin-bottom: 20px;
        }

        .total-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #FF8C42;
        }

        .week-day-item {
            border-bottom: 1px solid #e0e0e0;
            padding: 15px 0;
        }

        .week-day-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .day-photos {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .day-photo-thumb {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div style="font-size: 1.5em;">☰</div>
        <h1>Piano Alimentare</h1>
        <div style="margin-left: auto; font-size: 1.3em;">🔍</div>
    </div>

    <div class="calendar-strip" id="calendarStrip"></div>

    <div class="content">
        <div id="dayViews"></div>
        
        <div id="weekView" class="week-view">
            <button class="btn-primary" onclick="window.print()" style="width: 100%; margin-bottom: 20px;">
                🖨️ Stampa Report Settimanale
            </button>
            <div class="week-summary">
                <div class="summary-total">
                    <div style="color: #666; margin-bottom: 10px;">Media Settimanale</div>
                    <div class="total-number" id="weekAverage">0 kcal</div>
                </div>
                <div id="weekDays"></div>
            </div>
        </div>
    </div>

    <div class="bottom-nav">
        <div class="nav-item active" onclick="showMainView()">
            <div class="nav-icon">🏠</div>
            <div class="nav-label">Pianifica pasti</div>
        </div>
        <div class="nav-item" onclick="showWeekView()">
            <div class="nav-icon">📊</div>
            <div class="nav-label">Report</div>
        </div>
        <div class="nav-item">
            <div class="nav-icon">🛒</div>
            <div class="nav-label">Lista spesa</div>
        </div>
    </div>

    <div id="addMealModal" class="modal">
        <div class="modal-content">
            <div class="modal-title">Aggiungi Pasto</div>
            <div class="form-group">
                <label class="form-label">Foto</label>
                <input type="file" id="mealPhoto" accept="image/*" style="display: none;" onchange="handlePhotoUpload(event)">
                <div class="photo-upload-area" onclick="document.getElementById('mealPhoto').click()">
                    <div style="font-size: 3em; margin-bottom: 10px;">📷</div>
                    <div>Clicca per aggiungere foto</div>
                </div>
                <img id="photoPreview" class="preview-img" style="display: none;">
            </div>
            <div class="form-group">
                <label class="form-label">Nome (opzionale)</label>
                <input type="text" id="mealName" class="form-input" placeholder="Es: Pasta al pomodoro">
            </div>
            <div class="form-group">
                <label class="form-label">Calorie (opzionale)</label>
                <input type="number" id="mealCalories" class="form-input" placeholder="Es: 450">
            </div>
            <div style="margin-top: 20px;">
                <button class="btn-primary" onclick="saveMeal()">Salva</button>
                <button class="btn-secondary" onclick="closeModal()">Annulla</button>
            </div>
        </div>
    </div>

    <script>
        var meals = [];
        var currentDate = new Date();
        var currentMealType = '';
        var photoData = null;

        function initCalendar() {
            var strip = document.getElementById('calendarStrip');
            var viewsContainer = document.getElementById('dayViews');
            var html = '';
            var viewsHtml = '';
            var days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
            
            var today = new Date();
            var day = today.getDay();
            var diff = today.getDate() - day + (day === 0 ? -6 : 1);
            var monday = new Date(today.setDate(diff));

            for (var i = 0; i < 7; i++) {
                var date = new Date(monday);
                date.setDate(monday.getDate() + i);
                var dateStr = date.toISOString().split('T')[0];
                var isToday = dateStr === new Date().toISOString().split('T')[0];
                
                html += '<div class="calendar-day ' + (isToday ? 'active' : '') + '" onclick="selectDay(\'' + dateStr + '\')">';
                html += '<div class="day-label">' + days[i] + '</div>';
                html += '<div class="day-number">' + date.getDate() + '</div>';
                html += '</div>';

                var dayName = days[i] + ', ' + date.getDate() + ' Ott';
                viewsHtml += '<div id="day-' + dateStr + '" class="day-section ' + (isToday ? 'active' : '') + '">';
                viewsHtml += '<div class="day-title">▸ ' + dayName + '</div>';
                
                viewsHtml += '<div class="meal-section">';
                viewsHtml += '<div class="meal-header"><div class="meal-icon">☕</div><div class="meal-title">Colazione</div></div>';
                viewsHtml += '<div class="meal-content" id="colazione-' + dateStr + '">';
                viewsHtml += '<button class="add-meal-btn" onclick="openAddMeal(\'colazione\', \'' + dateStr + '\')">➕ Colazione</button>';
                viewsHtml += '</div></div>';

                viewsHtml += '<div class="meal-section">';
                viewsHtml += '<div class="meal-header"><div class="meal-icon">🍽️</div><div class="meal-title">Pranzo</div></div>';
                viewsHtml += '<div class="meal-content" id="pranzo-' + dateStr + '">';
                viewsHtml += '<button class="add-meal-btn" onclick="openAddMeal(\'pranzo\', \'' + dateStr + '\')">➕ Pranzo</button>';
                viewsHtml += '</div></div>';

                viewsHtml += '<div class="meal-section">';
                viewsHtml += '<div class="meal-header"><div class="meal-icon">🍷</div><div class="meal-title">Cena</div></div>';
                viewsHtml += '<div class="meal-content" id="cena-' + dateStr + '">';
                viewsHtml += '<button class="add-meal-btn" onclick="openAddMeal(\'cena\', \'' + dateStr + '\')">➕ Cena</button>';
                viewsHtml += '</div></div>';

                viewsHtml += '<button class="snack-btn" onclick="openAddMeal(\'snack\', \'' + dateStr + '\')">➕ Aggiungi snack</button>';
                viewsHtml += '</div>';
            }
            
            strip.innerHTML = html;
            viewsContainer.innerHTML = viewsHtml;
        }

        function selectDay(dateStr) {
            var days = document.querySelectorAll('.calendar-day');
            for (var i = 0; i < days.length; i++) {
                days[i].classList.remove('active');
            }
            event.target.closest('.calendar-day').classList.add('active');

            var sections = document.querySelectorAll('.day-section');
            for (var i = 0; i < sections.length; i++) {
                sections[i].classList.remove('active');
            }
            document.getElementById('day-' + dateStr).classList.add('active');
        }

        function openAddMeal(type, date) {
            currentMealType = type;
            currentDate = date;
            document.getElementById('addMealModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('addMealModal').classList.remove('active');
            document.getElementById('mealPhoto').value = '';
            document.getElementById('mealName').value = '';
            document.getElementById('mealCalories').value = '';
            document.getElementById('photoPreview').style.display = 'none';
            photoData = null;
        }

        function handlePhotoUpload(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    photoData = e.target.result;
                    document.getElementById('photoPreview').src = e.target.result;
                    document.getElementById('photoPreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        }

        function saveMeal() {
            if (!photoData && !document.getElementById('mealName').value) {
                alert('Aggiungi almeno una foto o un nome!');
                return;
            }

            var meal = {
                id: Date.now(),
                type: currentMealType,
                date: currentDate,
                name: document.getElementById('mealName').value,
                calories: parseInt(document.getElementById('mealCalories').value) || 0,
                photo: photoData,
                time: new Date().toTimeString().slice(0, 5)
            };

            meals.push(meal);
            closeModal();
            renderMeal(meal);
        }

        function renderMeal(meal) {
            var container = document.getElementById(meal.type + '-' + meal.date);
            var existingBtn = container.querySelector('.add-meal-btn');
            
            var html = '<div class="meal-item">';
            if (meal.photo) {
                html += '<img src="' + meal.photo + '" class="meal-photo-small">';
            }
            html += '<div class="meal-info-inline">';
            html += '<div class="meal-name">' + (meal.name || meal.type.charAt(0).toUpperCase() + meal.type.slice(1)) + '</div>';
            html += '<div class="meal-details">';
            if (meal.calories > 0) {
                html += meal.calories + ' kcal';
            }
            html += '</div></div>';
            html += '<div class="delete-icon" onclick="deleteMeal(' + meal.id + ')">×</div>';
            html += '</div>';

            if (existingBtn) {
                existingBtn.insertAdjacentHTML('beforebegin', html);
            } else {
                container.innerHTML = html;
            }
        }

        function deleteMeal(id) {
            if (confirm('Eliminare questo pasto?')) {
                meals = meals.filter(function(m) { return m.id !== id; });
                initCalendar();
                for (var i = 0; i < meals.length; i++) {
                    renderMeal(meals[i]);
                }
            }
        }

        function showMainView() {
            document.getElementById('weekView').classList.remove('active');
            document.querySelectorAll('.day-section').forEach(function(el) {
                el.style.display = 'none';
            });
            var today = new Date().toISOString().split('T')[0];
            var todaySection = document.getElementById('day-' + today);
            if (todaySection) {
                todaySection.classList.add('active');
                todaySection.style.display = 'block';
            }
            
            var navItems = document.querySelectorAll('.nav-item');
            for (var i = 0; i < navItems.length; i++) {
                navItems[i].classList.remove('active');
            }
            navItems[0].classList.add('active');
        }

        function showWeekView() {
            document.querySelectorAll('.day-section').forEach(function(el) {
                el.style.display = 'none';
            });
            document.getElementById('weekView').classList.add('active');
            renderWeekView();
            
            var navItems = document.querySelectorAll('.nav-item');
            for (var i = 0; i < navItems.length; i++) {
                navItems[i].classList.remove('active');
            }
            navItems[1].classList.add('active');
        }

        function renderWeekView() {
            var today = new Date();
            var day = today.getDay();
            var diff = today.getDate() - day + (day === 0 ? -6 : 1);
            var monday = new Date(today.setDate(diff));

            var weekDates = [];
            for (var i = 0; i < 7; i++) {
                var date = new Date(monday);
                date.setDate(monday.getDate() + i);
                weekDates.push(date.toISOString().split('T')[0]);
            }

            var html = '';
            var weekTotal = 0;
            var days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

            for (var i = 0; i < weekDates.length; i++) {
                var date = weekDates[i];
                var dayMeals = meals.filter(function(m) { return m.date === date; });
                var dayTotal = 0;
                for (var j = 0; j < dayMeals.length; j++) {
                    dayTotal += dayMeals[j].calories;
                }
                weekTotal += dayTotal;

                var d = new Date(date);
                html += '<div class="week-day-item">';
                html += '<div class="week-day-header">';
                html += '<span>' + days[i] + ' ' + d.getDate() + '/10</span>';
                html += '<span style="color: #FF8C42;">' + dayTotal + ' kcal</span>';
                html += '</div>';
                
                if (dayMeals.length > 0) {
                    html += '<div class="day-photos">';
                    for (var j = 0; j < dayMeals.length; j++) {
                        if (dayMeals[j].photo) {
                            html += '<img src="' + dayMeals[j].photo + '" class="day-photo-thumb">';
                        }
                    }
                    html += '</div>';
                }
                html += '</div>';
            }

            document.getElementById('weekDays').innerHTML = html;
            document.getElementById('weekAverage').textContent = Math.round(weekTotal / 7) + ' kcal';
        }

        initCalendar();
    </script>
</body>
</html>
