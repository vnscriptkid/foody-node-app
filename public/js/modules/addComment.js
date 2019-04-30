import axios from 'axios';

function handleAddComment(e) {
    e.preventDefault();
    console.log(e.target);
    const formEle = e.target;
    const url = formEle.action;
    axios
        .post(url, {
            text: formEle.querySelector('#reviewTextarea').value,
            rating: parseInt(formEle.querySelector('input[name="rating"]:checked').value)
        })
        .then(result => {
            console.log('res: ', result);
            const reviewBox = document.getElementById('reviewBox');
            // const newCommentHtml = `
            // .d-flex.border.align-items-center.p-3
            // .w-10.pl-5                  
            //     img.rounded-circle(src=`${review.author.gravatar}`)
            // .w-30.pl-5
            //     p.text-muted= fromNow(review.created)
            //     p= review.author.name
            // .flex-grow-1.pl-5
            //     div
            //         each star in [1,2,3,4,5]
            //             i.fas.fa-star(style=`color: ${(star <= review.rating) ? '#fae635' : 'gray'}`)
            //     p= review.text
            //     <div class="d-flex border align-items-center p-3">
            //         <div class="w-10 pl-5">

            //         </div>
            //         <div class="w-30 pl-5">

            //         </div>
            //         <div class="flex-grow-1 pl-5">

            //         </div>
            //     </div>
            // `

        })
        .catch(err => console.error(err));
}

export default handleAddComment;