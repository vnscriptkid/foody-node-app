import axios from 'axios';

const searchDropdown = document.getElementById('searchDropdown');

function produceDropdownListHtml(storeList) {
    return storeList.map(store => `<a class="dropdown-item" href="/stores/${store.slug}">${store.name}</a>`).join('');
}

function findActiveChildInParent(parentEle) {
    const children = Array.from(parentEle.childNodes);
    const activeChild = children.find(child => child.classList.contains('active'));
    return activeChild;
}

function searchStores(searchInput) {
    if (!searchInput) {
        return;
    }
    let active = -1;

    searchInput.addEventListener('input', function() {
        axios.get(`/api/search?q=${this.value}`)
            .then(res => {
                // active = -1;
                if (res.data.length > 0) {
                    searchDropdown.style.display = 'block';
                    searchDropdown.innerHTML = produceDropdownListHtml(res.data);
                } else {
                    // no search result
                    searchDropdown.style.display = 'none';
                    searchDropdown.innerHTML = '';
                }
            })
            .catch(err => console.warn(err));
    })


    searchInput.addEventListener('keyup', function(e) {
        // debugger; 
        e.preventDefault();
        // 38 up
        // 40 down
        // 13 enter
        if (![38, 40, 13].includes(e.keyCode)) return;
        const activeChild = findActiveChildInParent(searchDropdown);
        const children = Array.from(searchDropdown.childNodes);
        let next;

        // if no dropdown, stop
        if (Array.from(searchDropdown.childNodes).length === 0) return;

        // otherwise, theres at least one child
        if (e.keyCode === 13 && activeChild) {
            return activeChild.click();
        }

        // case 1: no active now, press down
        if (!activeChild && e.keyCode === 40) {
            next = children[0];
        }
        // case 2: active exists, press down
        else if (activeChild && e.keyCode === 40) {
            next = activeChild.nextSibling || children[children.length - 1];
        }
        // case 3: active exists, press up
        else if (activeChild && e.keyCode === 38) {
            next = activeChild.previousSibling || children[0];
        }

        next.classList.add('active');
        if (activeChild && activeChild.classList.contains('active') && activeChild !== next) {
            activeChild.classList.remove('active');
        }

    })
}

export default searchStores;