import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import querystring from "query-string";
import io from "socket.io-client";
import { css } from "emotion";
import ScrollToBottom from "react-scroll-to-bottom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		height: "100vh",
		overflowY: "hidden",
	},
	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up("sm")]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	chatText: {
		color: "white",
	},
}));

const ROOT_CSSS = css({
	height: 500,
	width: "100%",
});

let socket;
const ChatBox = ({ location }) => {
	const classes = useStyles();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);
	const [chat, setChat] = useState("");
	const [name, setName] = React.useState("");
	const [room, setRoom] = React.useState("");
	const [privateUser, setPrivateUser] = React.useState({});
	const [error, setError] = React.useState("");

	const ENDPOINT = "https://room-private-chat-app.herokuapp.com";

	React.useEffect(() => {
		const { name, room } = querystring.parse(location.search);
		setName(name);
		setRoom(room);
		socket = io(ENDPOINT, { forceNew: true });
		socket.emit("joinRoom", { username: name, room: room });

		return () => {
			socket.emit("disconnect");
			socket.off();
		};
	}, [ENDPOINT, location.search]);

	React.useEffect(() => {
		socket.on("message", (message) => {
			setMessages([...messages, message]);
		});
	}, [messages]);

	React.useEffect(() => {
		socket.on("roomData", (data) => {
			console.log("users", data.users);
			data.users.map((user) => {
				setUsers([...users, user]);
			});
		});
	}, [users]);

	React.useEffect(() => {
		socket.on("Connect_failed", () => {
			setError("Sorry there seems to be an issue with the connection");
		});
	});
	React.useEffect(() => {
		socket.on("Reconnect_failed", () => {
			setError("Your device has failed to reconnect");
		});
	});
	React.useEffect(() => {
		socket.on("Error", () => {
			setError("Connection Error");
		});
	});

	const handleChat = () => {
		if (chat) {
			socket.emit("chatMessage", chat);
			setChat("");
		}
	};
	const joinFriend = (friendId) => {
		socket.emit("joinFriend", { friendId: friendId, sender: name });
		setRoom(privateUser.username);
	};
	const privateChat = () => {
		socket.emit("privateMessage", chat);
		setChat("");
	};
	console.log(chat, messages);
	const drawer = (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<h2>Room Members</h2>
			{users.map((user, index) => (
				<List
					style={{ display: `${user.username == name ? "none" : "inline"}` }}
					key={index}>
					<ListItem button>
						<Link
							onClick={(e) => {
								e.preventDefault();
								console.log("user", user);
								setPrivateUser(user);
								joinFriend(user.id);
							}}>
							<ListItemText>
								<Typography>{user.username}</Typography>
							</ListItemText>
						</Link>
					</ListItem>
				</List>
			))}
		</div>
	);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}>
						X
					</IconButton>
					<Typography variant="h6" noWrap>
						Chat Room
					</Typography>
					<div style={{ width: "50rem" }}></div>
					<Button
						href="/"
						size="medium"
						variant="outlined"
						style={{
							backgroundColor: "white",
							color: "blue",
							marginLeft: "1em",
						}}>
						Leave Chat
					</Button>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						variant="temporary"
						anchor={theme.direction === "rtl" ? "right" : "left"}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<section>
					{privateUser.id ? (
						<div>{privateUser.username}</div>
					) : (
						<div>
							<List>
								<ListItem
									style={{
										backgroundColor: "black",
										textTransform: "capitalize",
										color: "white",
									}}
									button>
									<ListItemText primary={`${room} Chat Room`} />
								</ListItem>
							</List>
						</div>
					)}
				</section>
				<section>
					<ScrollToBottom className={ROOT_CSSS}>
						{messages
							? messages.map((message, index) => {
									return (
										<div
											style={{
												display: "flex",
												flexBasis: "20%",
												justifyContent: "flex-end",
												backgroundColor: `${
													message.user === "admin" ? "grey" : "#2979FF"
												}`,
												color: "black",
												borderBottomLeftRadius: "1rem",
												borderBottomRightRadius: "2rem",
												borderTopLeftRadius: "1rem",
												marginBottom: "1rem",
											}}
											key={index}>
											<ListItem style={{ color: "black" }}>
												<ListItemAvatar>
													<Avatar>{message.user.slice(0, 2)}</Avatar>
												</ListItemAvatar>
												<ListItemText
													className={classes.chatText}
													primary={`${
														message.user === name ? "You" : message.user
													}`}
													secondary={
														<Typography
															style={{
																color: `${
																	message.user === "admin" ? "blue" : "white"
																}`,
															}}>
															{message.text}
														</Typography>
													}
												/>
											</ListItem>
										</div>
									);
							  })
							: ""}
					</ScrollToBottom>
				</section>
				<Divider />
				<div
					style={{
						marginBottom: "5rem",
					}}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							{
								privateUser.id ? privateChat() : handleChat();
							}
						}}>
						<TextField
							variant="outlined"
							style={{ width: "60%" }}
							type="text"
							value={chat}
							onChange={(e) => setChat(e.target.value)}
							placeholder="Type your message..."
						/>
						<Button
							style={{
								backgroundColor: "blue",
								color: "white",
								marginLeft: "1em",
							}}
							type="submit">
							Send
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
};

export default ChatBox;
