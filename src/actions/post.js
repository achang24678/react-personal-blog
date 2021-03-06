import uuid from 'uuid';
import database from '../firebase/firebase';

export const addPost = (post) => ({
    type: 'ADD_POST',
    post
});
export const startCreatePost = (postData) => {
    return (dispatch, getState) =>{
        const uid = getState().auth.uid;
       
        const {
            title = '',
            body = '',
            createdAt = 0,
            photo = getState().auth.photoURL,
            name = getState().auth.displayName
        } = postData;
        const post = { title, body, createdAt, photo, name };
        database.ref('postcol').push(post);

        return database.ref(`users/${uid}/posts`).push(post).then((ref) => {
            dispatch(addPost({id: ref.key, ...post}));
        });
    }
}

export const setPosts = (posts) => ({
    type: 'SET_POSTS',
    posts
});

export const startFetchPost = () => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        return database.ref('postcol').once('value').then((snapshot) => {
            const posts = [];
            snapshot.forEach((childSnapshot) => {
                posts.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            console.log(posts);
            dispatch(setPosts(posts));
        })
    }
   
}
export const removePost = ({id} = {}) => ({
    type: 'REMOVE_POST',
    id
});

export const startRemovePost = ({id} = {}) => {
    return(dispatch, getState) => {
        const uid = getState().auth.uid;
        database.ref(`postcol/${id}`).remove();
        return database.ref(`users/${uid}/posts/${id}`).remove().then(() => {
            dispatch(removePost({ id }));
        })
    }
}
export const editPost = (id, updates) => ({
    type: 'EDIT_POST',
    id,
    updates
});

export const startEditPost = (id, updates) => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        database.ref(`postcol/${id}`).update(updates);
        return database.ref(`users/${uid}/posts/${id}`).update(updates).then(() => {
            dispatch(editPost(id, updates));
        });
    };
};
