document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById("postsContainer");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    function getPosts() {
        return JSON.parse(localStorage.getItem('forumPosts') || '{}');
    }

    function savePosts(posts) {
        localStorage.setItem('forumPosts', JSON.stringify(posts));
    }

    function renderPosts() {
        const posts = getPosts();
        const entries = Object.entries(posts);

        const search = searchInput.value.toLowerCase();
        const sort = sortSelect.value;

        let filtered = entries.filter(([id, post]) =>
            post.title.toLowerCase().includes(search) ||
            post.description.toLowerCase().includes(search) ||
            post.tags.toLowerCase().includes(search)
        );

        if (sort === 'newest') filtered.sort((a, b) => b[1].createdAt - a[1].createdAt);
        if (sort === 'oldest') filtered.sort((a, b) => a[1].createdAt - b[1].createdAt);
        if (sort === 'az') filtered.sort((a, b) => a[1].title.localeCompare(b[1].title));

        postsContainer.innerHTML = '';
        filtered.forEach(([id, post]) => {
            const postEl = document.createElement("div");
            postEl.className = "post";
            postEl.innerHTML = `
                <h3>${post.title}</h3>
                <small>Objavio: ${post.username} | ${new Date(post.createdAt).toLocaleString()}</small>
                <p>${post.description}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image">` : ''}
                <div class="tag">${post.tags}</div>
                <div class="post-actions">
                    <button class="like-btn" data-id="${id}">👍 <span>${post.likes || 0}</span></button>
                    <button class="dislike-btn" data-id="${id}">👎 <span>${post.dislikes || 0}</span></button>
                </div>
                <div class="comments">
                    <input type="text" placeholder="Komentiraj..." onkeydown="addComment(event, '${id}')">
                    <ul>${(post.comments || []).map(c => `<li>${c}</li>`).join('')}</ul>
                </div>
            `;
            postsContainer.appendChild(postEl);
        });

        addVotingListeners();
    }

    function addVotingListeners() {
        document.querySelectorAll(".like-btn").forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute("data-id");
                const posts = getPosts();
                posts[id].likes = (posts[id].likes || 0) + 1;
                savePosts(posts);
                renderPosts();
            };
        });

        document.querySelectorAll(".dislike-btn").forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute("data-id");
                const posts = getPosts();
                posts[id].dislikes = (posts[id].dislikes || 0) + 1;
                savePosts(posts);
                renderPosts();
            };
        });
    }

    postForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const tags = document.getElementById('tags').value;
        const imageFile = document.getElementById('imageInput').files[0];

        let imageUrl = null;
        if (imageFile) {
            imageUrl = URL.createObjectURL(imageFile); // TEMP
        }

        const id = Date.now().toString();
        const newPost = {
            username,
            title,
            description,
            tags,
            imageUrl,
            createdAt: Date.now(),
            likes: 0,
            dislikes: 0,
            comments: []
        };

        const posts = getPosts();
        posts[id] = newPost;
        savePosts(posts);
        postForm.reset();
        renderPosts();
    });

    searchInput.addEventListener("input", renderPosts);
    sortSelect.addEventListener("change", renderPosts);

    window.addComment = function (e, id) {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            const posts = getPosts();
            if (!posts[id].comments) posts[id].comments = [];
            posts[id].comments.push(e.target.value.trim());
            savePosts(posts);
            e.target.value = "";
            renderPosts();
        }
    };

    // Optional: Gumb za reset
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Obriši sve postove";
    clearBtn.style.marginBottom = "20px";
    clearBtn.onclick = () => {
        if (confirm("Jesi siguran/na da želiš obrisati sve postove?")) {
            localStorage.removeItem('forumPosts');
            renderPosts();
        }
    };
    document.querySelector(".forum-section").insertBefore(clearBtn, postForm);

    renderPosts();
});
