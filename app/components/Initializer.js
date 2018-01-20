import { BASE_DATE, getDayDiff } from '../components/SM2'
const TODAY = getDayDiff(BASE_DATE, new Date());

import RNFetchBlob from 'react-native-fetch-blob';
import { colors } from 'react-native-elements';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs


