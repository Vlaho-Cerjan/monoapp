import React from 'react'
import Link from 'next/link'
import { observer, useLocalObservable } from 'mobx-react'
import {
    Icon,
    Menu,
    Sidebar,
    List,
  } from 'semantic-ui-react'

const MenuSidebar = observer(() => {
    const view = useLocalObservable(() => ({
        visible: false,
        setVisible(bool) {
            this.visible = bool; 
        }
    }))

    return (
        <div
            className="sidebar-container"
        >
            <Icon 
                link
                className="sidebar-icon"
                name="sidebar"
                size='big'
                onClick={() => view.setVisible(true)}
            >
            </Icon>
            
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={() => view.setVisible(false)}
                vertical
                visible={view.visible}
            >
                <List
                    celled    
                    relaxed
                    size="medium"
                >
                    <List.Item>
                        <List.Content>
                            <Link 
                                href="/"
                            >
                                <a 
                                    onClick={() => view.setVisible(false)}
                                    className="menu-link"
                                >
                                    Home
                                </a>       
                            </Link>
                            <List.Icon 
                                name='home' 
                                size='big'
                            />
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <Link
                                href="/vehicleMake"
                            >
                                <a 
                                    onClick={() => view.setVisible(false)}
                                    className="menu-link"
                                >
                                    Vehicle Make
                                </a> 
                            </Link>
                            <List.Icon 
                                name='edit outline' 
                                size='big'
                            />
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <Link
                                href="/vehicleModel"
                            >
                                <a 
                                    onClick={() => view.setVisible(false)}
                                    className="menu-link"
                                >
                                    Vehicle Model
                                </a> 
                            </Link>
                            <List.Icon 
                                name='edit outline'
                                size='big'
                            />
                        </List.Content>
                    </List.Item>
                </List>
            </Sidebar>
        </div>
        
    )
})

export default MenuSidebar;