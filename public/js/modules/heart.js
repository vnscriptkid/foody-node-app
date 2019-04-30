import axios from 'axios';

function updateHeartTotal(user) {
    if (!user) return;
    const heartTotal = document.getElementById('heartTotal');
    if (heartTotal) {
        heartTotal.innerText = user.hearts.length;
    }
}

function updateHeart(heartEle) {
    if (heartEle) {
        const currentColor = heartEle.style.color;
        heartEle.style.color = currentColor === 'red' ? 'gray' : 'red';
    }
}

function handleSubmit(e) {
    e.preventDefault();
    const url = e.target.action;
    const heartEle = e.target.querySelector('.fas.fa-heart');
    axios.get(url)
        .then(res => {
            console.log('update hearts: ', res.data);
            updateHeart(heartEle);
            updateHeartTotal(res.data);
        })
        .catch(err => console.warn('err: ', err));
}

export default handleSubmit;



