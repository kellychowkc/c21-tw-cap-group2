import React, { useEffect, useState, ReactNode } from 'react'

import {
    Box,
    Button,
    chakra,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    Modal,
    ModalOverlay,
    SimpleGrid,
    Stack,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'

import {
    MdNaturePeople,
    MdSearch,
    MdTimelapse,
    MdWarning,
} from 'react-icons/md'

import { AuthState } from '../../../redux/state'
import { RootState, RootThunkDispatch } from '../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsersList } from '../../../redux/manageUser/manageUserThunk'
import {
    getUserFriends,
    getUserProfile,
    updateUserPermission,
    UserProfile,
} from '../../../api/user'
import PermissionSetting from './PermissionSetting'
import { UsersList } from './userList'
import { ModalUserFriends, ModalUserProfileDetail } from './ModalManageUser'

export interface IUser {
    first_name: string
    last_name: string
    username: string
    profile: string
}

const demoUser: UserProfile = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_num: '',
    created_at: '',
    updated_at: '',

    birthday: '',
    profile: '',
}

interface IStats {
    name: number | string
    stats: number | string
}
const demoStats: any = {
    activeTime: {
        name: 'Active Time',
        stats: '15 mins',
    },
    matchCount: {
        name: 'Match Count',
        stats: '25',
    },
    matchRate: {
        name: 'Match Rate',
        stats: '100%',
    },
}

interface StatsCardProps {
    title: string
    stat: string
    icon: ReactNode
}
function StatsCard(props: StatsCardProps) {
    const { title, stat, icon } = props
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'lg'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}
        >
            <Flex justifyContent={'space-between'} minW={'100px'}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={'medium'}>{title}</StatLabel>
                    <StatNumber fontSize={'lg'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={'auto'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    alignContent={'center'}
                >
                    {icon}
                </Box>
            </Flex>
        </Stat>
    )
}

export interface Permission {
    displayName: string
    name: string
    value: boolean
}

export default function ManageUser() {
    const auth: AuthState = useSelector((state: any) => state.auth)
    const dispatch = useDispatch<RootThunkDispatch>()

    //Get all users list
    useEffect(() => {
        const result = dispatch(getAllUsersList()).then((data) => {
            // console.log(data)
            if (data.success) {
                console.log('<getAllUserList> Dispatch Success')
            } else {
                console.log('<getAllUserList> Dispatch Fail')
            }
        })
    }, [])

    const [viewUser, setViewUser] = React.useState<string>('')
    const [userProfile, setUserProfile] = React.useState<UserProfile>(demoUser)

    // view selected user profile & permission setting
    useEffect(() => {
        if (viewUser) {
            const result = getUserProfile(viewUser).then((data) => {
                console.log('View user data = ', data)
                if (data.success) {
                    console.log('<getUserProfile> Fetch Success')
                    setUserProfile(data.userProfile)
                    setPermission_post(data.userProfile.isAdmin)
                } else {
                    console.log('<getUserProfile> Fetch Fail')
                }
            })

            // permissions.map((permission: Permission) => {
            //     // `setPermission_${permission.name}(${permission.value})`
            //     if (permission.name === 'visible') {
            //         setPermission_visible(permission.value)
            //     } else if (permission.name === 'matching') {
            //         setPermission_matching(permission.value)
            //     } else if (permission.name === 'post') {
            //         setPermission_post(permission.value)
            //     } else if (permission.name === 'comment') {
            //         setPermission_comment(permission.value)
            //     } else if (permission.name === 'upload') {
            //         setPermission_upload(permission.value)
            //     }
            // })
        }
    }, [viewUser])

    const [permission_visible, setPermission_visible] =
        useState<Permission['value']>(false)
    const [permission_matching, setPermission_matching] =
        useState<Permission['value']>(false)
    const [permission_post, setPermission_post] =
        useState<Permission['value']>(false)
    const [permission_comment, setPermission_comment] =
        useState<Permission['value']>(false)
    const [permission_upload, setPermission_upload] =
        useState<Permission['value']>(false)

    const permissions: Permission[] = [
        {
            displayName: 'Visible by others',
            name: 'visible',
            value: permission_visible,
        },
        {
            displayName: 'Matching',
            name: 'matching',
            value: permission_matching,
        },
        { displayName: 'Create post', name: 'post', value: permission_post },
        { displayName: 'Comment', name: 'comment', value: permission_comment },
        {
            displayName: 'Upload Picture',
            name: 'upload',
            value: permission_upload,
        },
    ]

    const handleChange_permission = (name: any) => {
        // `setPermission_${name}(!permission_${name})`
        console.log('handleChange_permission is pressed')
        if (name === 'visible') {
            setPermission_visible(!permission_visible)
        } else if (name === 'matching') {
            setPermission_matching(!permission_matching)
        } else if (name === 'post') {
            setPermission_post(!permission_post)
        } else if (name === 'comment') {
            setPermission_comment(!permission_comment)
        } else if (name === 'upload') {
            setPermission_upload(!permission_upload)
        }
    }

    // user permission
    useEffect(() => {
        console.log('Permission had been changed!!!')

        console.log(
            permission_visible,
            permission_matching,
            permission_post,
            permission_comment,
            permission_upload
        )

        const permissionUpdates = [
            permission_visible,
            permission_matching,
            permission_post,
            permission_comment,
            permission_upload,
        ]
        if (viewUser) {
            const result = updateUserPermission(
                viewUser,
                permissionUpdates
            ).then((data) => {
                // console.log('Set user permissions = ', data)

                if (data.success) {
                    console.log('<updateUserPermission> Fetch Success')
                    console.log(data.result)
                } else {
                    console.log('<updateUserPermission> Fetch Fail')
                }
            })
        }
    }, [
        permission_visible,
        permission_matching,
        permission_post,
        permission_comment,
        permission_upload,
    ])

    const reduxUserListData = useSelector(
        (state: RootState) => state.manageUser
    )

    const [searchUser, setSearchUser] = React.useState('')
    const handleChange_searchUser = (event: any) =>
        setSearchUser(event.target.value)

    // Modal popup for showing user profile detail and friends
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [modalType, setModalType] = useState<string>('')

    const [viewFriendsById, setViewFriendsById] = useState<number | undefined>(
        undefined
    )
    const [userFriends, setUserFriends] = useState<Array<any>>([])

    useEffect(() => {
        if (viewFriendsById) {
            const result = getUserFriends(viewFriendsById).then((data) => {
                console.log('View user friends = ', data)
                if (data.success) {
                    console.log('<getUserFriends> Fetch Success')
                } else {
                    console.log('<getUserFriends> Fetch Fail')
                }
                setUserFriends(data.userFriends)
            })
        }
    }, [viewFriendsById])

    return (
        <Box maxW="7xl" mx={'auto'} px={{ base: 2, sm: 12, md: 17 }}>
            <chakra.h1
                textAlign={'center'}
                fontSize={'4xl'}
                py={1}
                fontWeight={'bold'}
            >
                User Management
            </chakra.h1>

            <Container py={5} maxW={'container.4xl'}>
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        lg: 'repeat(2, 1fr)',
                    }}
                    gap={6}
                >
                    <GridItem w="100%" h="50%" maxH="50%">
                        <Stack
                            spacing={4}
                            w={'full'}
                            minW={'md'}
                            maxW={'xl'}
                            h="auto"
                            bg={useColorModeValue('white', 'gray.700')}
                            rounded={'xl'}
                            boxShadow={'lg'}
                            p={6}
                        >
                            <SimpleGrid
                                columns={{ base: 1, lg: 2 }}
                                spacing={{ base: 5, lg: 8 }}
                            >
                                <StatsCard
                                    title={demoStats.activeTime.name}
                                    stat={demoStats.activeTime.stats}
                                    icon={<MdTimelapse size={'2em'} />}
                                />
                                <StatsCard
                                    title={'User Match Count/%'}
                                    stat={
                                        demoStats.matchCount.stats +
                                        ' / ' +
                                        demoStats.matchRate.stats
                                    }
                                    icon={<MdNaturePeople size={'2em'} />}
                                />
                            </SimpleGrid>
                            <Heading
                                lineHeight={1.1}
                                fontSize={{ base: '2xl', sm: '3xl' }}
                            >
                                User Profile
                            </Heading>

                            <SimpleGrid
                                columns={{ base: 1, lg: 2 }}
                                spacing={{ base: 5, lg: 8 }}
                            >
                                <Flex
                                    className="leftBoardLeft"
                                    w="100%"
                                    wrap="wrap"
                                    direction={{
                                        base: 'row',
                                        sm: 'column',
                                        md: 'column',
                                        lg: 'row',
                                        xl: 'row',
                                    }}
                                    justify="center"
                                    alignContent="center"
                                    alignItems="center"
                                >
                                    <Box m={1} h="min-content" w="90%">
                                        <FormControl id="userName">
                                            <FormLabel>User Name</FormLabel>
                                            <Input
                                                placeholder="Username"
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                value={userProfile.username}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box m={1} h="min-content" w="90%">
                                        <FormControl id="first_name">
                                            <FormLabel>First Name</FormLabel>
                                            <Input
                                                placeholder="First Name"
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                value={userProfile.first_name}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box m={1} h="min-content" w="90%">
                                        <FormControl id="last_name">
                                            <FormLabel>Last Name</FormLabel>
                                            <Input
                                                placeholder="Last Name"
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                value={userProfile.last_name}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box m={1} h="min-content" w="90%">
                                        <FormControl id="birthday">
                                            <FormLabel>Birthday</FormLabel>
                                            <Input
                                                placeholder="Birthday"
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                value={userProfile.birthday}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Box>

                                    <Stack
                                        className="buttonGroup"
                                        direction={'column'}
                                        justifyContent="space-around"
                                        alignItems="center"
                                        alignContent={'space-around'}
                                        h="max-content"
                                    >
                                        <Stack
                                            my="3px"
                                            p="3px"
                                            spacing={4}
                                            direction={['column', 'row']}
                                        >
                                            <Button
                                                id="button_UserProfileDetail"
                                                bg={'teal.400'}
                                                color={'white'}
                                                size="md"
                                                _hover={{
                                                    bg: 'teal.500',
                                                }}
                                                onClick={() => {
                                                    setModalType('profile')
                                                    onOpen()
                                                }}
                                            >
                                                Detail
                                            </Button>
                                            <Button
                                                id="button_UserFriends"
                                                bg={'blue.400'}
                                                color={'white'}
                                                size="md"
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}
                                                onClick={() => {
                                                    setViewFriendsById(
                                                        userProfile.id
                                                    )
                                                    setModalType('friends')
                                                    onOpen()
                                                }}
                                            >
                                                Friends
                                            </Button>
                                            <Modal
                                                id="modal_ManageUser"
                                                isOpen={isOpen}
                                                onClose={onClose}
                                                size="xl"
                                            >
                                                <ModalOverlay />
                                                {modalType === 'profile' ? (
                                                    <ModalUserProfileDetail
                                                        userProfile={
                                                            userProfile
                                                        }
                                                        userFriends={
                                                            userFriends
                                                        }
                                                        disclosure={{
                                                            onOpen,
                                                            isOpen,
                                                            onClose,
                                                        }}
                                                    />
                                                ) : (
                                                    <ModalUserFriends
                                                        userProfile={
                                                            userProfile
                                                        }
                                                        userFriends={
                                                            userFriends
                                                        }
                                                        disclosure={{
                                                            onOpen,
                                                            isOpen,
                                                            onClose,
                                                        }}
                                                    />
                                                )}
                                            </Modal>
                                        </Stack>
                                        <Stack
                                            my="3px"
                                            p="3px"
                                            spacing={4}
                                            direction={['column', 'row']}
                                        >
                                            <Button
                                                bg={'orange.400'}
                                                color={'white'}
                                                size="md"
                                                _hover={{
                                                    bg: 'orange.500',
                                                }}
                                                onClick={() => {
                                                    setPermission_comment(false)
                                                    setPermission_matching(
                                                        false
                                                    )
                                                    setPermission_post(false)
                                                    setPermission_upload(false)
                                                    setPermission_visible(false)
                                                }}
                                            >
                                                Suspend
                                            </Button>
                                            <Button
                                                bg={'red.400'}
                                                color={'white'}
                                                size="md"
                                                _hover={{
                                                    bg: 'red.500',
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Flex>
                                <Flex className="leftBoardRight">
                                    <VStack>
                                        <Box
                                            className="profileHistory"
                                            fontSize="sm"
                                        >
                                            <Text
                                                fontSize={'sm'}
                                                fontWeight={'semibold'}
                                            >
                                                Member Since:
                                                {' ' +
                                                    userProfile.created_at!.split(
                                                        'T',
                                                        1
                                                    )}
                                            </Text>
                                            <Text
                                                fontSize={'sm'}
                                                fontWeight={'semibold'}
                                            >
                                                Last Update:
                                                {' ' +
                                                    userProfile.updated_at!.split(
                                                        'T',
                                                        1
                                                    )}
                                            </Text>
                                        </Box>
                                        <HStack
                                            className="profilePictures"
                                            spacing={0}
                                        >
                                            <Box bg="teal" w="66%">
                                                <Image
                                                    src={
                                                        auth.profile
                                                            ? auth.profile
                                                            : 'https://avatars.dicebear.com/api/male/username.svg'
                                                    }
                                                />
                                            </Box>
                                            <Box w="33%">
                                                <VStack w="100%" spacing={0}>
                                                    <Box bg="red">
                                                        <Image src="https://avatars.dicebear.com/api/male/username.svg" />
                                                    </Box>
                                                    <Box bg="green">
                                                        <Image src="https://avatars.dicebear.com/api/male/username.svg" />
                                                    </Box>
                                                </VStack>
                                            </Box>
                                        </HStack>
                                        <VStack
                                            className="profileComplains"
                                            w="100%"
                                            spacing={0}
                                            p="3px"
                                            shadow={'lg'}
                                            border={'1px solid'}
                                            borderColor={useColorModeValue(
                                                'gray.800',
                                                'gray.500'
                                            )}
                                            rounded={'lg'}
                                        >
                                            <Text
                                                fontSize={'lg'}
                                                fontWeight={'bold'}
                                            >
                                                Complain <Icon as={MdWarning} />
                                            </Text>
                                            <HStack
                                                w="100%"
                                                spacing={0}
                                                justifyContent="space-evenly"
                                            >
                                                <Box>Submitted: {'#'}</Box>
                                                <Box>Received: {'#'}</Box>
                                            </HStack>
                                        </VStack>
                                        <VStack
                                            className="profilePermissionSetting"
                                            w="100%"
                                            spacing={0}
                                            p="3px"
                                            shadow={'lg'}
                                            border={'1px solid'}
                                            borderColor={useColorModeValue(
                                                'gray.800',
                                                'gray.500'
                                            )}
                                            rounded={'lg'}
                                        >
                                            <Text
                                                fontSize={'lg'}
                                                fontWeight={'bold'}
                                            >
                                                Permission Setting
                                            </Text>
                                            <PermissionSetting
                                                permissions={permissions}
                                                changePermission={(
                                                    name: string
                                                ) => {
                                                    handleChange_permission(
                                                        name
                                                    )
                                                }}
                                            />
                                        </VStack>
                                    </VStack>
                                </Flex>
                            </SimpleGrid>
                        </Stack>
                    </GridItem>
                    <GridItem w="100%" h="50%" maxH="50%">
                        <Stack
                            spacing={4}
                            w={'full'}
                            minW={'md'}
                            maxW={'xl'}
                            bg={useColorModeValue('white', 'gray.700')}
                            rounded={'xl'}
                            boxShadow={'lg'}
                            p={6}
                        >
                            <Flex
                                w="100%"
                                wrap="wrap"
                                direction={'column'}
                                justify="space-evenly"
                            >
                                <Box
                                    className="searchUser"
                                    w="90%"
                                    m={3}
                                    px="5px"
                                    bg="gray.200"
                                    rounded={'15px'}
                                    boxShadow={'lg'}
                                >
                                    <HStack>
                                        <FormControl id="searchUser">
                                            <Input
                                                placeholder="Search user info"
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                border="0"
                                                _focus={{
                                                    outline: 'none',
                                                    border: '0px',
                                                }}
                                                type="text"
                                                onChange={
                                                    handleChange_searchUser
                                                }
                                                value={searchUser}
                                            />
                                        </FormControl>
                                        <Icon as={MdSearch} h="30px" w="30px" />
                                    </HStack>
                                </Box>
                                <Box
                                    w="90%"
                                    m={3}
                                    bg={useColorModeValue('white', 'gray.400')}
                                    rounded={'15px'}
                                    scrollBehavior="smooth"
                                    overflowY="scroll"
                                    overflowX={'hidden'}
                                    maxH="550px"
                                    h={'400px'}
                                >
                                    <UsersList
                                        list={
                                            reduxUserListData.userList as IUser[]
                                        }
                                        viewUser={(username: string) => {
                                            setViewUser(username)
                                        }}
                                    />
                                </Box>
                            </Flex>
                        </Stack>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}
