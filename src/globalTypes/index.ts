export type TJwtPayload = {
	id: string;
	name: string;
	email: string;
	role: "CUSTOMER" | "ADMIN";
};
