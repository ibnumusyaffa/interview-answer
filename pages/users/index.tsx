/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { deleteUser, getUsers } from '@/services/user'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'

import { useDebounce } from '@/hooks/useDebounce'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/alert-dialog'
import { Button, ButtonIcon } from '@/components/button'
import { EmptyState } from '@/components/empty-state'
import { InputSearch } from '@/components/input'
import { NativeSelect } from '@/components/native-select'
import { Pagination } from '@/components/pagination'
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/table'
import { useToast } from '@/components/toast'

export default function Example() {
  const router = useRouter()
  const [showAlert, setShowAlert] = useState(false)
  const [currentId, setCurrentId] = useState(0)
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    setPage(1)
  }, [debouncedKeyword])

  const { data, status, isFetching } = useQuery({
    queryKey: ['users', page, limit, debouncedKeyword],
    queryFn: () => getUsers(page, limit, debouncedKeyword),
    keepPreviousData: true,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  async function handleDelete() {
    try {
      setIsDeleting(true)
      await deleteUser(currentId)
      toast.success({
        title: 'User Deleted',
        description: 'The user has been successfully deleted.',
      })
      setShowAlert(false)
      setIsDeleting(false)
    } catch (error) {
      setShowAlert(false)
      setIsDeleting(false)
      toast.danger({
        title: 'User Deleted',
        description: 'The user has been successfully deleted.',
      })
    }
  }

  return (
    <div>
      <AlertDialog
        open={showAlert}
        onOpenChange={(value) => setShowAlert(value)}
      >
        <AlertDialogCloseButton></AlertDialogCloseButton>
        <AlertDialogContent
          title="Delete user"
          description="Are you sure you want to delete this user ? This action cannot be undone."
        ></AlertDialogContent>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button variant="default">Cancel</Button>
          </AlertDialogCancel>
          <Button
            loading={isDeleting}
            onClick={handleDelete}
            color="danger"
            variant="solid"
          >
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialog>
      {/*-------------------------------------------------------------------------*/}
      <div className="mb-5 flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-800">
          Users Management
        </div>
        <div className="flex  space-x-3">
          <Button
            onClick={() => router.push('/users/create')}
            leftIcon={<PlusIcon className="h-4 w-4"></PlusIcon>}
          >
            Add User
          </Button>
        </div>
      </div>
      {/*-------------------------------------------------------------------------*/}
      <div className=" border border-gray-200 bg-white">
        <div className="flex justify-start  px-5 py-5">
          <div className="flex w-80 space-x-3 ">
            <InputSearch
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search User..."
            ></InputSearch>
          </div>
        </div>
        {/*-------------------------------------------------------------------------*/}
        <div className="">
          <Table withBorder loading={status === 'loading' || isFetching}>
            <Thead>
              <Tr>
                <Th className="w-10">No.</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Created At</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {status === 'success' ? (
                <React.Fragment>
                  {data?.data?.map((item, index) => {
                    return (
                      <Tr key={index}>
                        <Td>{limit * page - limit + index + 1}</Td>
                        <Td>{item.fullname}</Td>
                        <Td>{item.email}</Td>
                        <Td>{item.created_at}</Td>

                        <Td>
                          <ButtonIcon
                            onClick={() => {
                              setShowAlert(true)
                              setCurrentId(item.id)
                            }}
                            variant="subtle"
                            color="danger"
                          >
                            <TrashIcon className="h-4 w-4"></TrashIcon>
                          </ButtonIcon>
                        </Td>
                      </Tr>
                    )
                  })}
                </React.Fragment>
              ) : null}

              {/*-------------------------------------------------------------------------*/}
              {data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={100} className="py-10">
                    <EmptyState
                      withIcon
                      title="No user found"
                      description="Your search did not match any project. Please try again or create project."
                      primaryAction={
                        <Button leftIcon={<PlusIcon></PlusIcon>}>
                          Create user
                        </Button>
                      }
                      secondaryAction={
                        <Button variant="default">Clear search</Button>
                      }
                    ></EmptyState>
                  </td>
                </tr>
              ) : null}
            </Tbody>
          </Table>
        </div>
        {/*-------------------------------------------------------------------------*/}
        <div className=" flex items-center justify-between px-5  py-5">
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <NativeSelect
              value={limit}
              onChange={(e) => {
                setPage(1)
                setLimit(parseInt(e.target.value))
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </NativeSelect>
            <div>Showing 10 of 100 items</div>
          </div>

          <Pagination
            page={page}
            total={data?.meta.totalPages ?? 0}
            onChange={(page) => {
              setPage(page)
            }}
          ></Pagination>
        </div>
      </div>
    </div>
  )
}
