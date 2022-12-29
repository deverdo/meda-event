import { render , screen,cleanup} from '@testing-library/react'
import Landing from '../../routes/Landing';

test('test' ,  () => {

  render(<Landing/>)

  expect('1+1').toBe('2')
})