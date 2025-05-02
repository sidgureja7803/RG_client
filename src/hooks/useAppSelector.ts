import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../features/store';

// Use throughout your app instead of plain `useSelector`
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector; 