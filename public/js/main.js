function toggleMobileMenu() {
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  }
}

function showWechat() {
  const modal = document.getElementById('wechatModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideWechat() {
  const modal = document.getElementById('wechatModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function submitAppointment(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  if (!data.name || !data.phone) {
    alert('请填写姓名和联系电话');
    return false;
  }
  
  if (!/^1[3-9]\d{9}$/.test(data.phone.replace(/-/g, ''))) {
    alert('请填写正确的手机号码');
    return false;
  }
  
  fetch('/appointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      alert(result.message);
      form.reset();
    } else {
      alert(result.message || '提交失败，请重试');
    }
  })
  .catch(err => {
    alert('提交失败，请重试');
    console.error(err);
  });
  
  return false;
}

document.addEventListener('DOMContentLoaded', function() {
  const appointmentForms = document.querySelectorAll('.appointment-form');
  appointmentForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formId = this.id;
      submitAppointment(formId);
    });
  });
});
