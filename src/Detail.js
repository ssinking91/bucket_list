//Detail.js
// 리액트 패키지를 불러옵니다.
import React from "react";
import { useParams, useHistory } from "react-router-dom";
// redux hook을 불러옵니다.
import { useDispatch, useSelector } from "react-redux";
// 내가 만든 액션 생성 함수를 불러옵니다.
import { deleteBucket, updateBucket, updateBucketFB, deleteBucketFB } from "./redux/modules/bucket";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const Detail = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const bucket_index = params.index;

    // 스토어에서 상태값 가져오기
    const bucket_list = useSelector((state) => state.bucket.list);
    // url 파라미터에서 인덱스 가져오기
    // let bucket_index = parseInt(props.match.params.index);
    //console.log(bucket_list)

    return (
        <div>
            <h1>{bucket_list[bucket_index] ? bucket_list[bucket_index].text : ""}</h1>
            {/* <button onClick={() => {
                console.log("완료하기 버튼을 눌렀어!");
                //dispatch(updateBucket(bucket_index));
                dispatch(updateBucketFB(bucket_list[bucket_index].id));
                history.push('/');
            }}>
                완료하기
            </button> */}

            <Button variant="outlined" color="success" startIcon={<SaveIcon />}
                onClick={() => {
                    console.log("완료하기 버튼을 눌렀어!");
                    //dispatch(updateBucket(bucket_index));
                    dispatch(updateBucketFB(bucket_list[bucket_index].id));
                    history.push('/');
                }}
            >
                완료하기
            </Button>

            {/* <button
                onClick={() => {
                    console.log("삭제하기 버튼을 눌렀어!");
                    //   dispatch(); <- 괄호안에는 액션 생성 함수가 들어가야겠죠?
                    //dispatch(deleteBucket(bucket_index));
                    //dispatch(updateBucketFB(bucket_list[bucket_index].id));
                    dispatch(deleteBucketFB(bucket_list[bucket_index].id));
                    history.push('/');
                }}
            >
                삭제하기
            </button> */}

            <Button variant="outlined" color="error" style={{ margin: 10 }} startIcon={<DeleteIcon />}
                onClick={() => {
                    console.log("삭제하기 버튼을 눌렀어!");
                    //   dispatch(); <- 괄호안에는 액션 생성 함수가 들어가야겠죠?
                    //dispatch(deleteBucket(bucket_index));
                    //dispatch(updateBucketFB(bucket_list[bucket_index].id));
                    dispatch(deleteBucketFB(bucket_list[bucket_index].id));
                    history.push('/');
                }}
            >
                삭제하기
            </Button>

            <Button variant="outlined" onClick={() => { history.goBack() }}>뒤로가기</Button>

        </div>
    );
};

export default Detail;
