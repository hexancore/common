#!/usr/bin/env bash
# Contains some useful functions for docker

#######################################
# Removes docker entities with selected type and label
# Globals:
#   None
# Arguments:
#  type - entity type:  volume, network
#  label - entity label
# Returns:
#   None
#######################################
function dockerutil::remove_entities_with_label {
    local type=$1
    local label=$2
    local sleep_time=${3:-2}
    local entities=$(docker $type ls -qf "label=$label")
    if [ -n "$entities" ]; then
        docker "$type" ls -qf "label=$label" | xargs -I{} docker $type rm "{}"
        sleep $sleep_time
    fi
}

#######################################
# Removes all docker entities with selected label
# Globals:
#   None
# Arguments:
#  label - entity label
#  [sleep_time] - how long sleep after remove all entities of one type(some entities need some time to remove)
# Returns:
#   None
#######################################
function dockerutil::clean_all_with_label() {
    local label=$1
    local sleep_time=${2:-2}
    utils::print_header "Removing entities with label: $label"
    for type in 'volume' 'network'
    do
        utils::print_arrow "removing ${type}s"
        set +e
        tries=0
        until [ $tries -ge 5 ]
        do
            tries=$[$tries+1]
            dockerutil::remove_entities_with_label "$type" "$label" $sleep_time && break

        done
        set -e
    done

}

#######################################
# Returns true when network with given name exists
# Globals:
#   None
# Arguments:
#   service_name
# Returns:
#   bool
#######################################
function dockerutil::network_exists {
    local exists=$(docker network ls -q -f "name=${1}\$")
    [ ! -z "$exists" ]
}

function dockerutil::exec_command_in_container {
    local container=$1
    local command=$2

    echo $(docker exec $container /bin/sh -c "$command")
}

function dockerutil::get_container_file_contents {
    local container=$1
    local filename=$2

    if [ ! $(dockerutil::exec_command_in_container $container "[ -f $filename ] && echo "1" || echo ''") ]; then
        utils::print_error "file: $filename in container not exists"
        return 1
    fi

    echo $(dockerutil::exec_command_in_container $container "cat $filename")
}