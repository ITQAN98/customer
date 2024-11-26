// دالة لجلب بيانات العملاء بناءً على الكلمة المفتاحية
const getData = async (searchKeyword) => {
    try {
        const { data } = await axios.get(`https://itqan-online.com/apps/test-visits/api.php?fun=main_search&key=${searchKeyword}`);
        return data.result.customers_list;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];  // في حال حدوث خطأ في جلب البيانات
    }
};

// دالة لعرض البيانات في الجدول بناءً على الكلمة المفتاحية للبحث
const displayData = async (searchKeyword = '') => {
    const customers = await getData(searchKeyword);
    if (customers.length === 0) {
        alert('لا توجد نتائج لهذا البحث');
    } else {
        renderTable(customers);
    }
};

// دالة لعرض العملاء في الجدول
const renderTable = (customerList) => {
    const tableBody = document.getElementById('customerListBody');
    tableBody.innerHTML = ''; // مسح المحتويات الحالية للجدول

    if (customerList.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">لا توجد بيانات لعرضها</td></tr>';
        return;
    }

    const rows = customerList.map(customer => {
        // حساب الأيام منذ آخر زيارة
        const daysSinceLastVisit = getDaysSinceLastVisit(customer.last_visit);

        return `
            <tr>
             <td>
                    <!-- صف الزر Wall وعدد الأيام -->
                    <div class="status">
                        <div class="days-container">
                            <span class="daysSinceLastVisit">${daysSinceLastVisit} </span>
                        </div>
                        <div class="wall-container">
                            <button class="wallButton" onclick="redirectToWall(${customer.customer_id})">Wall</button>
                        </div>
                    </div>
                </td>
                            <td>${customer.customer_name}</td>
                <td>${customer.customer_id}</td>
               
            </tr>
        `;
    }).join(''); // تحويل البيانات إلى صفوف داخل الجدول

    tableBody.innerHTML = rows; // إضافة الصفوف إلى جسم الجدول
};

// دالة لحساب الأيام منذ آخر زيارة
const getDaysSinceLastVisit = (lastVisitDate) => {
    const lastVisit = new Date(lastVisitDate);
    const currentDate = new Date();
    const diffTime = currentDate - lastVisit;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // تحويل الوقت إلى أيام
};

// دالة للانتقال إلى صفحة Wall عند الضغط على زر Wall
const redirectToWall = (customerId) => {
    window.location.href = `./addVisit.html?customer_id=${customerId}`;
};

// دالة لتفعيل البحث عند الضغط على زر البحث
const searchCustomers = () => {
    const searchKeyword = document.getElementById('searchInput').value.trim(); // التحقق من الفراغات
    if (searchKeyword !== '') {
        displayData(searchKeyword); // عرض النتائج بناءً على الكلمة المفتاحية
    } else {
        alert('الرجاء إدخال كلمة للبحث');
    }
};

// حدث الضغط على زر البحث
document.getElementById('searchButton').addEventListener('click', searchCustomers);

// إضافة دالة لتسجيل الخروج
document.getElementById('logoutButton').addEventListener('click', function() {
    window.location.href = './index.html';
});

// دالة لإظهار نموذج إضافة العميل
document.getElementById('addCustomerButton').addEventListener('click', function() {
    const form = document.getElementById('addCustomerForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// إغلاق نموذج إضافة العميل
function closeAddForm() {
    document.getElementById('addCustomerForm').style.display = 'none';
}

// دالة لإضافة العميل إلى قاعدة البيانات
document.getElementById('addCustomerFormDetails').addEventListener('submit', function(e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const groupName = document.getElementById('groupName').value;

    axios.get(`https://itqan-online.com/apps/test-visits/api.php?fun=addCustomer&name=${customerName}&grp=${groupName}`)
        .then(response => {
            if (response.data.result === 'Customer_Added_Successfully') {
                alert('تم إضافة العميل بنجاح');
                document.getElementById('addCustomerFormDetails').reset();
                document.getElementById('addCustomerForm').style.display = 'none';
                displayData(); // إعادة تحميل البيانات بعد إضافة العميل
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('فشل الاتصال بالخادم');
        });
});

// دالة لعرض أسماء المجموعات في شريط البحث
// دالة لعرض أسماء المجموعات في شريط البحث
const displayGroups = async () => {
    try {
        const { data } = await axios.get('https://itqan-online.com/apps/test-visits/api.php?fun=getCustomers');
        const groups = data.result.groups_list;

        const groupContainer = document.getElementById('groupContainer');
        groupContainer.innerHTML = ''; // مسح المجموعات السابقة

        groups.forEach(group => {
            const groupButton = document.createElement('button');
            groupButton.textContent = group.group_name; // تأكد من إضافة اسم المجموعة بشكل صحيح
            groupButton.classList.add('groupButton');
            groupButton.addEventListener('click', () => searchByGroup(group.group_name)); // استخدم group.group_name هنا بشكل صحيح
            groupContainer.appendChild(groupButton);
        });

    } catch (error) {
        console.error('Error fetching groups:', error);
    }
};


// دالة للبحث بناءً على اسم المجموعة
const searchByGroup = async (groupName) => {
    try {
        console.log('Searching for group:', groupName);

        // جلب البيانات الخاصة بالعملاء في هذه المجموعة
        const { data } = await axios.get(`https://itqan-online.com/apps/test-visits/api.php?fun=main_search&key=${groupName}`);
        const customers = data.result.customers_list;

        if (customers.length === 0) {
            console.log(`لا توجد نتائج لمجموعة ${groupName}`);
            alert(`لا توجد نتائج لهذه المجموعة: ${groupName}`);
        } else {
            renderTable(customers); // عرض العملاء في الجدول
        }
    } catch (error) {
        console.error('Error fetching group customers:', error);
    }
};

// تحميل المجموعات عند فتح الصفحة
displayGroups();

// تحميل البيانات عند فتح الصفحة
displayData(); // عرض البيانات افتراضياً عند تحميل الصفحة
