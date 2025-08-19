let jobsData = [];
let activeFilters = [];

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    jobsData = data;
    renderJobs(jobsData);
  })
  .catch((err) => console.error(err));

function renderJobs(list) {
  const jobCard = document.querySelector(".job-card");
  jobCard.innerHTML = "";

  list.forEach((item) => {
    jobCard.innerHTML += `
      <div class="card">
        <div class="job-info">
          <img src="${item.logo}" class="logo" />
          <div class="info">
            <div class="company-info">
              <p>${item.company}</p>
              ${item.new ? `<span class="new">NEW!</span>` : ""}
              ${item.featured ? `<span class="featured">FEATURED</span>` : ""}
            </div>
            <div class="position"><h3>${item.position}</h3></div>
            <div class="anotherInfo">
              <p>${item.postedAt}</p>
              <p>${item.contract}</p>
              <p>${item.location}</p>
            </div>
          </div>
        </div>

        <div class="tags">
          <button class="filter-btn">${item.role}</button>
          ${item.languages
            .map((lang) => `<button class="filter-btn">${lang}</button>`)
            .join("")}
          ${
            item.tools
              ? item.tools
                  .map((tool) => `<button class="filter-btn">${tool}</button>`)
                  .join("")
              : ""
          }
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => addFilter(btn.textContent));
  });
}

function addFilter(value) {
  if (!activeFilters.includes(value)) {
    activeFilters.push(value);
  }
  updateFilterBar();
  filterJobs();
}

function removeFilter(value) {
  activeFilters = activeFilters.filter((f) => f !== value);
  updateFilterBar();
  filterJobs();
}

function updateFilterBar() {
  const filterBar = document.querySelector(".filter-bar");
  const filtersDiv = document.querySelector(".filters");

  filtersDiv.innerHTML = activeFilters
    .map(
      (f) => `
      <div class="tag">
        <span>${f}</span>
        <button class="remove" data-value="${f}">×</button>
      </div>
    `
    )
    .join("");

  filterBar.classList.toggle("hidden", activeFilters.length === 0);

  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFilter(btn.dataset.value));
  });

  document.querySelector(".clear").onclick = () => {
    activeFilters = [];
    updateFilterBar();
    renderJobs(jobsData);
  };
}

function filterJobs() {
  let filtered = jobsData.filter((job) => {
    let tags = [job.role, ...job.languages, ...(job.tools || [])];
    return activeFilters.every((f) => tags.includes(f));
  });
  renderJobs(filtered);
}
