import React from "react";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	TextField,
	Button,
	Select,
	MenuItem,
} from "@material-ui/core";

const Chat = (props) => {
	const [name, setName] = React.useState("");
	const [room, setRoom] = React.useState("");

	return (
		<div>
			<Card
				style={{
					width: "50%",
					marginLeft: "auto",
					marginRight: "auto",
					marginTop: "10rem",
				}}>
				<CardContent>
					<TextField
						type="text"
						name="name"
						variant="outlined"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter your name"
					/>
					<h4>Select Room</h4>

					<Select
						id="demo-simple-select"
						value={room}
						onChange={(e) => setRoom(e.target.value)}>
						<MenuItem value="Lagos">Lagos</MenuItem>
						<MenuItem value="Abuja">Abuja</MenuItem>
						<MenuItem value="PH">PH</MenuItem>
						<MenuItem value="Enugu">Enugu</MenuItem>
					</Select>
					<div>
						<Link
							onClick={(e) => (!name || !room ? e.preventDefault() : null)}
							to={`/chat?name=${name}&room=${room}`}>
							<Button
								disabled={props.disabled}
								variant="contained"
								style={{
									backgroundColor: "blue",
									color: "white",
									marginTop: "1rem",
								}}
								size="medium"
								type="submit">
								Join
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Chat;
