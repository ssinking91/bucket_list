import { db } from "../../firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

// 액션 타입을 정해줍니다.
const LOAD = "bucket/LOAD";
const CREATE = "bucket/CREATE";
const UPDATE = "bucket/UPDATE"
const DELETE = "bucket/DELETE";
const LOADED = "bucket/LOADED";

// 초기 상태값을 만들어줍니다.
const initialState = {
    is_loaded: false,
    list: [],
};

// 액션 생성 함수예요.
// 액션을 만들어줄 함수죠!
export function loadBucket(bucket_list) {
    return { type: LOAD, bucket_list };
}

export function createBucket(bucket) {
    console.log("액션을 생성!");
    return { type: CREATE, bucket: bucket };
}

export function updateBucket(bucket_index) {
    console.log("업데이트!");
    return { type: UPDATE, bucket_index };
}

export function deleteBucket(bucket_index) {
    console.log("삭제", bucket_index);
    return { type: DELETE, bucket_index };
}

export function isLoaded(loaded) {
    return { type: LOADED, loaded };
  }

  //미들웨어
export const loadBucketFB = () => {
    return async function (dispatch) {
        // 데이터를 가져와요!
        const bucket_data = await getDocs(collection(db, "bucket"));

        let bucket_list = [];

        // 하나씩 우리가 쓸 수 있는 배열 데이터로 만들어줍시다!
        bucket_data.forEach((b) => {
            // 콘솔로 확인해요!
            console.log(b.id, b.data());
            bucket_list.push({ id: b.id, ...b.data() });
        });

        // 잘 만들어졌는 지 리스트도 확인해봐요! :)
        console.log(bucket_list);
        dispatch(loadBucket(bucket_list));
    }
}
// 파이어베이스랑 통신하는 부분 
export const createBucketFB = (bucket) => {
    return async function (dispatch) {
        dispatch(isLoaded(false));
        // 파이어스토어에 추가하기를 기다려요!
        const docRef = await addDoc(collection(db, "bucket"), bucket);
        console.log((await getDoc(docRef)).data());
        // 추가한 데이터 중 id를 가져와서 bucket_data를 만들어줬어요!
        const bucket_data = { id: docRef.id, ...bucket };
        // 그럼 이제 액션을 일으키자! (수정해달라고 요청하자!)
        dispatch(createBucket(bucket_data));
    }
}

// 파이어베이스랑 통신하는 부분
export const updateBucketFB = (bucket_id) => {
    return async function (dispatch, getState) {
        // 수정할 도큐먼트를 가져오고,
        const docRef = doc(db, "bucket", bucket_id);
        // 수정합시다!
        await updateDoc(docRef, { completed: true });
        // getState()를 사용해서 스토어의 데이터를 가져올 수 있어요.
        console.log(getState().bucket);
        // bucket list 데이터를 가져와요.
        const _bucket_list = getState().bucket.list;
        // findIndex로 몇 번째에 있는 지 찾기!
        const bucket_index = _bucket_list.findIndex((b) => {
            // updateBucketFB의 파라미터로 넘겨받은 아이디와 
            // 아이디가 독같은 요소는 몇 번째에 있는 지 찾아봐요!
            return b.id === bucket_id;
        })

        dispatch(updateBucket(bucket_index));
    };
};

// 파이어베이스랑 통신하는 부분
export const deleteBucketFB = (bucket_id) => {
    return async function (dispatch, getState) {
        if (!bucket_id) {
            window.alert("아이디가 없네요!");
            return;
        }
        const docRef = doc(db, "bucket", bucket_id);
        await deleteDoc(docRef);

        const _bucket_list = getState().bucket.list;
        const bucket_index = _bucket_list.findIndex((b) => {
            return b.id === bucket_id;
        });

        dispatch(deleteBucket(bucket_index));
    }
}

// 리듀서예요.
// 실질적으로 store에 들어가 있는 데이터를 변경하는 곳이죠!
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {

        case "bucket/LOAD": {
            return { list: action.bucket_list, is_loaded: true }
        }

        case "bucket/CREATE": {
            console.log(action);
            console.log("이제 값을 바꿀거야!");
            const new_bucket_list = [...state.list, action.bucket];
            return {...state, list: new_bucket_list, is_loaded: true };
        }

        case "bucket/UPDATE": {
            console.log(action);
            console.log("이제 업데이트 할거야!");
            const new_bucket_list = state.list.map((l, idx) => {
                if (parseInt(action.bucket_index) === idx) {
                    return { ...l, completed: true }
                } else {
                    return l
                }
            });

            return { ...state, list: new_bucket_list };
        }

        case "bucket/DELETE": {
            console.log(action);
            console.log("이제 삭제 할거야!");
            const new_bucket_list = state.list.filter((l, idx) => {
                return parseInt(action.bucket_index) !== idx;
            });

            return { ...state, list: new_bucket_list };
        }

        case "bucket/LOADED": {
            return { ...state, is_loaded: action.loaded };
          }
        default:
            return state;
    }
}
