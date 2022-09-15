import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    HStack,
    IconButton,
    FlexProps,
} from '@chakra-ui/react'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

import { useSelector } from 'react-redux'
import { AuthState } from '../../../redux/state'

interface LinkItemProps {
    name: string
    path: string
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Destinations', path: '/destination' },
    { name: 'Safety', path: '/contact' },
    { name: 'Control Panel', path: '/control' },
]

interface NavItemProps extends FlexProps {
    children: string | number
    path: string
}

const NavLink = ({ children, path, ...rest }: NavItemProps) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={path}
    >
        {children}
    </Link>
)

export default function Nav(): JSX.Element {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()

    //update usename from redux
    const auth: AuthState = useSelector((state: any) => state.auth)

    return (
        <Flex
            w="98vw"
            h="auto"
            minW="270px"
            zIndex={9999}
            justify="center"
            align="center"
            m="0"
            p="0"
            border="0"
            position="sticky"
            top="0"
        >
            <Box
                w="100%"
                bg={useColorModeValue('gray.100', 'gray.900')}
                px={4}
                m="0"
            >
                <Flex
                    w="100%"
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                Nomader
                            </Link>
                        </Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{
                                base: 'none',
                                md: 'flex',
                            }}
                        >
                            {LinkItems.map((link) => (
                                <NavLink key={link.name} path={link.path}>
                                    {link.name}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? (
                                    <MoonIcon />
                                ) : (
                                    <SunIcon />
                                )}
                            </Button>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}
                                >
                                    <Avatar
                                        size={'sm'}
                                        src={
                                            'https://avatars.dicebear.com/api/male/username.svg'
                                        }
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            src={
                                                'https://avatars.dicebear.com/api/male/username.svg'
                                            }
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>{auth.username}</p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>Your Profile</MenuItem>
                                    <MenuItem>Account Settings</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {LinkItems.map((link) => (
                                <NavLink key={link.name} path={link.path}>
                                    {link.name}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </Flex>
    )
}