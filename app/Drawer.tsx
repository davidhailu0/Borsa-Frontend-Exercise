import { Drawer } from "react-native-paper"
import { router } from "expo-router"

const CustomDrawer = ({page}:{page:string})=>{
    return <Drawer.Section title="Profile">
    <Drawer.Item
      label="Home"
      active={page==="Home"}
      onPress={()=>{
        router.push("/Home")
      }}
    />
    <Drawer.Item
      label="Profile"
      active={page==="Profile"}
      onPress={()=>{
        router.push("/Profile")
      }}
    />
    </Drawer.Section>
}

export default CustomDrawer