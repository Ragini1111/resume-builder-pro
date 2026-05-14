
let projCount = 0, expCount = 0;

let updating = false;
function update() {
  if(updating) return;
  updating = true;
  // Basic info
  document.getElementById('r-name').innerText = document.getElementById('name').value || 'Your Name';
  const contact = [
    document.getElementById('tagline').value,
    document.getElementById('email').value,
    document.getElementById('phone').value,
    document.getElementById('github').value,
    document.getElementById('linkedin').value
  ].filter(Boolean).join(' | ');
  document.getElementById('r-contact').innerText = contact;

  // Education
  if(document.getElementById('edu1').value) {
    document.getElementById('r-edu-section').innerHTML = `
      <h2>EDUCATION</h2>
      <div class="item">
        <h3><span>${document.getElementById('edu1').value}</span> <span class="date">${document.getElementById('edu2').value}</span></h3>
        <div class="sub">${document.getElementById('edu3').value}</div>
      </div>`;
  }

  // Experience
  let expHTML = '';
  for(let i=1; i<=expCount; i++) {
    if(!document.getElementById(`exp${i}title`)) continue;
    const title = document.getElementById(`exp${i}title`).value;
    if(!title) continue;
    expHTML += `
      <div class="item">
        <h3><span>${title}</span> <span class="date">${document.getElementById(`exp${i}date`).value}</span></h3>
        <ul><li>${document.getElementById(`exp${i}b1`).value}</li></ul>
      </div>`;
  }
  document.getElementById('r-exp-section').innerHTML = expHTML ? `<h2>EXPERIENCE</h2>${expHTML}` : '';

  // Projects
  let projHTML = '';
  for(let i=1; i<=projCount; i++) {
    if(!document.getElementById(`p${i}title`)) continue;
    const title = document.getElementById(`p${i}title`).value;
    if(!title) continue;
    const b1 = document.getElementById(`p${i}b1`).value;
    const b2 = document.getElementById(`p${i}b2`).value;
    projHTML += `
      <div class="item">
        <h3>${title}</h3>
        <div class="sub">${document.getElementById(`p${i}tech`).value}</div>
        <ul>${b1 ? `<li>${b1}</li>` : ''}${b2 ? `<li>${b2}</li>` : ''}</ul>
      </div>`;
  }
  document.getElementById('r-proj-section').innerHTML = projHTML ? `<h2>PROJECTS</h2>${projHTML}` : '';

  // Skills
  document.getElementById('r-skills1').innerText = document.getElementById('skills1').value;
  document.getElementById('r-skills2').innerText = document.getElementById('skills2').value;

  // Achievements
  const achieve = document.getElementById('achieve').value.split('\n').filter(a=>a.trim());
  document.getElementById('r-achieve').innerHTML = achieve.map(a=>`<li>${a.replace(/^- /,'')}</li>`).join('');

  // Auto-save
  saveData();
  updating = false;
}

function addProject() {
  projCount++;
  const html = `
    <div id="p${projCount}-block">
      <h2>Project ${projCount} <button class="btn-del" onclick="removeBlock('p${projCount}-block')">×</button></h2>
      <label>Title + Links</label><input id="p${projCount}title" oninput="update()">
      <label>Tech</label><input id="p${projCount}tech" oninput="update()">
      <label>Bullet 1</label><textarea id="p${projCount}b1" oninput="update()"></textarea>
      <label>Bullet 2</label><textarea id="p${projCount}b2" oninput="update()"></textarea>
    </div>`;
  document.getElementById('project-container').insertAdjacentHTML('beforeend', html);
}

function addExperience() {
  expCount++;
  const html = `
    <div id="exp${expCount}-block">
      <h2>Experience ${expCount} <button class="btn-del" onclick="removeBlock('exp${expCount}-block')">×</button></h2>
      <label>Company + Role</label><input id="exp${expCount}title" oninput="update()">
      <label>Duration</label><input id="exp${expCount}date" placeholder="Jun 2025 - Aug 2025" oninput="update()">
      <label>Bullet</label><textarea id="exp${expCount}b1" oninput="update()"></textarea>
    </div>`;
  document.getElementById('exp-container').insertAdjacentHTML('beforeend', html);
}

function removeBlock(id) {
  document.getElementById(id).remove();
  update();
}

function changeTheme() {
  const color = document.getElementById('theme').value;
  document.querySelectorAll('#resume h2').forEach(h2 => h2.style.borderBottomColor = color);
}

function saveData() {
  const data = {};
  document.querySelectorAll('.form input,.form textarea,.form select').forEach(el => data[el.id] = el.value);
  data.projCount = projCount; data.expCount = expCount;
  localStorage.setItem('resumeData', JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('resumeData') || '{}');
  projCount = data.projCount || 0; expCount = data.expCount || 0;
  
  for(let i=1; i<=projCount; i++) addProject();
  for(let i=1; i<=expCount; i++) addExperience();
  
  setTimeout(() => {
    Object.keys(data).forEach(id => {
      const el= document.getElementById(id);
      if(el) el.value = data[id];
    });
    update(); changeTheme();
  }, 100);
}

function loadExample() {
  document.getElementById('name').value = 'RAGINI GUPTA';
  document.getElementById('tagline').value = 'ECE @ Academy of Technology | Developer';
  document.getElementById('email').value = 'rg9949321@gmail.com';
  document.getElementById('phone').value = '7439527314';
  document.getElementById('github').value = 'github.com/raginigupta';
  document.getElementById('linkedin').value = 'linkedin.com/in/raginigupta';
  document.getElementById('edu1').value = 'B.Tech ECE, Academy of Technology, Hooghly';
  document.getElementById('edu2').value = '2022-2026';
  document.getElementById('edu3').value = 'CGPA: 8.7/10';
  addProject();
  document.getElementById('p1title').value = '8085 Simulator | Live | GitHub';
  document.getElementById('p1tech').value = 'React, JavaScript';
  document.getElementById('p1b1').value = 'Built web-based 8085 simulator with 10K+ views from juniors';
  document.getElementById('p1b2').value = 'Implemented all 74 instructions, flag register, step execution';
  document.getElementById('skills1').value = 'C, C++, Python, JavaScript, Verilog, 8085 Assembly';
  document.getElementById('skills2').value = 'React, Node.js, Git, MongoDB, Arduino, MATLAB';
  document.getElementById('achieve').value = '- Rank 1, College 8085 Debugging Contest 2025\n- Top 5%, NPTEL Programming in C';
  update();
}

function downloadPDF() {
  const element = document.getElementById('resume');
  const opt = {
    margin: [10,10,10,10],
    filename: `${document.getElementById('name').value.replace(/ /g,'_')}_Resume.pdf`,
    image: {type: 'jpeg', quality: 0.98},
    html2canvas: {scale: 2, useCORS: true},
    jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
    pagebreak: {mode: 'avoid-all'}
  };
  html2pdf().set(opt).from(element).save();
}

window.onload = update();