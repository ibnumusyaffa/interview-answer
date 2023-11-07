import axios from '@/lib/axios'

type User = {
  id: number
  email: string
  fullname: string
  created_at: string
}
type Meta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type UserList = {
  meta: Meta
  data: User[]
}

export async function getUsers(
  page: number,
  limit: number,
  keyword?: string
): Promise<UserList> {
  const response = await axios.get('http://dev.badr.co.id:7777/user', {
    params: {
      page,
      limit,
      keyword,
    },
  })
  return response.data
}

export async function deleteUser(id: number) {
  return axios.delete(`http://dev.badr.co.id:7777/user/${id}`)
}
