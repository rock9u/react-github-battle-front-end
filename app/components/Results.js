import React from 'react'
import { battle } from '../utils/api'

export default class Results extends React.Component {

    componentDidMount() {
        const { player1, player2 } = this.props

        battle([player1, player2])
            .then((players) => {
                console.log("data:", players);
            })
    }
    render() {
        return (
            <div>
                Results
                <pre>{JSON.stringify(this.props, null, 2)}</pre>
            </div>
        )
    }
}